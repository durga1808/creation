package com.zaga.handler;

import com.mongodb.client.AggregateIterable;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.model.Accumulators;
import com.mongodb.client.model.Aggregates;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Projections;
import com.mongodb.client.model.Sorts;
import com.zaga.entity.oteltrace.scopeSpans.Spans;
import com.zaga.entity.queryentity.trace.StatusCodeRange;
import com.zaga.entity.queryentity.trace.TraceDTO;
import com.zaga.entity.queryentity.trace.TraceMetrics;
import com.zaga.entity.queryentity.trace.TraceQuery;
import com.zaga.repo.TraceQueryRepo;

import io.quarkus.mongodb.panache.PanacheQuery;
import io.quarkus.panache.common.Page;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.bson.Document;
import org.bson.conversions.Bson;

@ApplicationScoped
public class TraceQueryHandler {

  @Inject
  TraceQueryRepo traceQueryRepo;

  @Inject
  MongoClient mongoClient;

  // getting all the datas from traceDTO entity
  public List<TraceDTO> getSampleTrace() {
    List<TraceDTO> traceList = traceQueryRepo.listAll();
    return traceList;
}



public List<TraceDTO> getTraceProduct() {
  List<TraceDTO> traceList = traceQueryRepo.listAll();
  return traceList;
}


private Bson createCustomDateFilter(LocalDate from, LocalDate to) {
  return Filters.and(
          Filters.gte("createdTime", from.atStartOfDay()),
          Filters.lt("createdTime", to.plusDays(1).atStartOfDay())
  );
}





private FindIterable<Document> getFilteredResults(TraceQuery query, int page, int pageSize, LocalDate from, LocalDate to, int minutesAgo) {
  List<Bson> filters = new ArrayList<>();

  if (from != null && to != null) {
      Bson timeFilter = createCustomDateFilter(from, to);
      filters.add(timeFilter);
  } else if (minutesAgo > 0) {
      LocalDate currentDate = LocalDate.now();

      if (from != null && from.isEqual(currentDate)) {
          // If the date is the current date, apply time filter based on minutes ago
          long currentTimeInMillis = System.currentTimeMillis();
          long timeAgoInMillis = currentTimeInMillis - (minutesAgo * 60 * 1000);
          Bson timeFilter = Filters.gte("createdTime", new Date(timeAgoInMillis));
          filters.add(timeFilter);
      } else if (from != null) {
          // If a specific date is provided, use it for filtering
          Bson timeFilter = createCustomDateFilter(from, from);
          filters.add(timeFilter);
      }
  }

  if (query.getMethodName() != null && !query.getMethodName().isEmpty()) {
      Bson methodNameFilter = Filters.in("methodName", query.getMethodName());
      filters.add(methodNameFilter);
  }

  if (query.getServiceName() != null && !query.getServiceName().isEmpty()) {
      Bson serviceNameFilter = Filters.in("serviceName", query.getServiceName());
      filters.add(serviceNameFilter);
  }

  if (query.getDuration() != null) {
      Bson durationFilter = Filters.and(
              Filters.gte("duration", query.getDuration().getMin()),
              Filters.lte("duration", query.getDuration().getMax())
      );
      filters.add(durationFilter);
  }

  List<Bson> statusCodeFilters = new ArrayList<>();
  if (query.getStatusCode() != null && !query.getStatusCode().isEmpty()) {
      for (StatusCodeRange statusCodeRange : query.getStatusCode()) {
          statusCodeFilters.add(
                  Filters.and(
                          Filters.gte("statusCode", statusCodeRange.getMin()),
                          Filters.lte("statusCode", statusCodeRange.getMax())
                  )
          );
      }
  }

  if (!statusCodeFilters.isEmpty()) {
      Bson statusCodeFilter = Filters.or(statusCodeFilters);
      filters.add(statusCodeFilter);
  }

  Bson filter = Filters.and(filters);

  MongoCollection<Document> collection = mongoClient
          .getDatabase("OtelTrace")
          .getCollection("TraceDTO");

  Bson projection = Projections.excludeId();

  System.out.println("Skip: " + (page - 1) * pageSize);
  System.out.println("Limit: " + pageSize);

  Bson sort = Sorts.descending("createdTime");

  return collection
          .find(filter)
          .projection(projection)
          .sort(sort)
          .skip((page - 1) * pageSize)
          .limit(pageSize);
}



  // getTrace by multiple queries like serviceName, method, duration and statuscode from TraceDTO entity
  public List<TraceDTO> searchTracesPaged(TraceQuery query, int page, int pageSize, LocalDate from, LocalDate to, int minutesAgo) {
    System.out.println("from Date --------------"+from);
    System.out.println("to Date --------------"+to);
  
    FindIterable<Document> result = getFilteredResults(query,page,pageSize,from,to,minutesAgo);
   
    List<TraceDTO> traceDTOList = new ArrayList<>();
    try (MongoCursor<Document> cursor = result.iterator()) {
        while (cursor.hasNext()) {
            Document document = cursor.next();
            TraceDTO traceDTO = new TraceDTO();

            traceDTO.setTraceId(document.getString("traceId"));
            traceDTO.setServiceName(document.getString("serviceName"));
            Object durationObject = document.get("duration");
            if (durationObject instanceof Integer) {
                traceDTO.setDuration(((Integer) durationObject).longValue());
            } else if (durationObject instanceof Long) {
                traceDTO.setDuration((Long) durationObject);
            }

            Object statusCodeObject = document.get("statusCode");
            if (statusCodeObject instanceof Integer) {
                traceDTO.setStatusCode(((Integer) statusCodeObject).longValue());
            } else if (statusCodeObject instanceof Long) {
                traceDTO.setStatusCode((Long) statusCodeObject);
            }
            traceDTO.setMethodName(document.getString("methodName"));
            traceDTO.setOperationName(document.getString("operationName"));
            traceDTO.setSpanCount(document.getString("spanCount"));
            traceDTO.setCreatedTime(document.getDate("createdTime"));
            traceDTO.setSpans((List<Spans>) document.get("spans"));

            traceDTOList.add(traceDTO);
        }
    }

    return traceDTOList;
}

public long countQueryTraces(TraceQuery query, LocalDate from, LocalDate to, int minutesAgo) {
  FindIterable<Document> result = getFilteredResults(query, 0, Integer.MAX_VALUE, from, to, minutesAgo);
  System.out.println("countQueryTraces: " + result.into(new ArrayList<>()).size());
  long totalCount = result.into(new ArrayList<>()).size();   
  return totalCount;
}





  // pagination data with merge and sorting implementations
  public List<TraceDTO> findRecentDataPaged(int page, int pageSize) {
    List<TraceDTO> traceList = traceQueryRepo.listAll();
    int startIndex = (page - 1) * pageSize;
    int endIndex = Math.min(startIndex + pageSize, traceList.size());
    return traceList.subList(startIndex, endIndex);
  }

  //Count calculation for pagination
  public long countData() {
    System.out.println(
      "TraceQueryHandler.countData()" + traceQueryRepo.count()
    );
    return traceQueryRepo.count();
  }



//two hour error data finding
public List<TraceDTO> findErrorsLastTwoHours(String serviceName) {
  Date twoHoursAgo = new Date(System.currentTimeMillis() - 2 * 60 * 60 * 1000);

  PanacheQuery<TraceDTO> query = traceQueryRepo.find("serviceName = ?1 and createdTime >= ?2", serviceName, twoHoursAgo);
  List<TraceDTO> traceList = query.list();

  List<TraceDTO> sortedTraceList = traceList.stream()
  .filter(traceDTO -> traceDTO.getStatusCode() != null && traceDTO.getStatusCode() >= 400 && traceDTO.getStatusCode() <= 599)
  .sorted(Comparator.comparing(TraceDTO::getCreatedTime).reversed())
  .collect(Collectors.toList());

return sortedTraceList;
}


  // appicall counts calculations
  public Map<String, Long> getTraceCountWithinHour() {
    List<TraceDTO> traceList = TraceDTO.listAll();

    Map<String, Long> serviceNameCounts = new HashMap<>();

    for (TraceDTO trace : traceList) {
      String serviceName = trace.getServiceName();
      serviceNameCounts.put(
        serviceName,
        serviceNameCounts.getOrDefault(serviceName, 0L) + 1
      );
    }

    return serviceNameCounts;
  }


  



//method for filtering page and page size, time and sortorder list out the data
   public List<TraceDTO> getPaginatedTraces(int page, int pageSize, int timeAgoMinutes) {
    Instant startTime = Instant.now().minus(timeAgoMinutes, ChronoUnit.MINUTES);
    List<TraceDTO> traces = traceQueryRepo.find("createdTime >= ?1", startTime)
            .page(Page.of(page - 1, pageSize))
            .list();

    return traces;
}

//time method for sortorder pagination
public long getTraceCountInMinutes(int page, int pageSize, int timeAgoMinutes) {
    Instant startTime = Instant.now().minus(timeAgoMinutes, ChronoUnit.MINUTES);
    return traceQueryRepo.find("createdTime >= ?1", startTime).count();
}

//sort order decending
public List<TraceDTO> getAllTracesOrderByCreatedTimeDesc(List<String> serviceNameList) {
  return traceQueryRepo.findAllOrderByCreatedTimeDesc(serviceNameList);
}

//sort order ascending
public List<TraceDTO> getAllTracesAsc(List<String> serviceNameList){
  return traceQueryRepo.findAllOrderByCreatedTimeAsc(serviceNameList);
}

// sort order error first
public List<TraceDTO> findAllOrderByErrorFirst(List<String> serviceNameList) {
  MongoCollection<Document> traceCollection = mongoClient
          .getDatabase("OtelTrace")
          .getCollection("TraceDTO");

  List<TraceDTO> allTraces = traceCollection.find(TraceDTO.class).into(new ArrayList<>());

  List<TraceDTO> sortedTraces = allTraces.stream()
          .filter(trace -> serviceNameList.contains(trace.getServiceName())) 
          .sorted(Comparator
                  // Sort by error status first (statusCode >= 400 && statusCode <= 599)
                  .comparing((TraceDTO trace) -> {
                      Long statusCode = trace.getStatusCode();
                      return (statusCode != null && statusCode >= 400 && statusCode <= 599) ? 0 : 1;
                  })
                  // Then sort by status code in descending order
                  .thenComparing(TraceDTO::getStatusCode, Comparator.nullsLast(Comparator.reverseOrder()))
                  // Finally, sort by created time in descending order
                  .thenComparing(TraceDTO::getCreatedTime, Comparator.nullsLast(Comparator.reverseOrder())))
          .collect(Collectors.toList());

  return sortedTraces;
}





public List<TraceDTO> findAllOrderByDuration(List<String> serviceNameList) {
  MongoCollection<Document> traceCollection = mongoClient
          .getDatabase("OtelTrace")
          .getCollection("TraceDTO");

  List<TraceDTO> allTraces = traceCollection.find(TraceDTO.class).into(new ArrayList<>());

  List<TraceDTO> sortedTraces = allTraces.stream()
          .filter(trace -> serviceNameList.contains(trace.getServiceName()))
          .filter(trace -> trace.getDuration() != null) // Add a null check for duration
          .sorted(Comparator
                  .comparing(TraceDTO::getDuration, Comparator.reverseOrder()))
          .collect(Collectors.toList());

  return sortedTraces;
}







// getByTraceId sort the spans and if some traceId Has same value it will merge the value
public List<Spans> sortingParentChildOrder(List<Spans> spanData) {
  Map<String, List<Spans>> spanTree = new HashMap<>();

  List<Spans> rootSpans = new ArrayList<>();

  for (Spans span : spanData) {
    // String spanId = span.getSpanId();
    String parentId = span.getParentSpanId();
    if (parentId == null || parentId.isEmpty()) {
      // Span with empty parentSpanId is a root span
      rootSpans.add(span);
    } else {
      spanTree.computeIfAbsent(parentId, k -> new ArrayList<>()).add(span);
    }
  }

  List<Spans> sortedSpans = new ArrayList<>();

  for (Spans rootSpan : rootSpans) {
    sortSpans(rootSpan, spanTree, sortedSpans);
  }

  return sortedSpans;
}

private void sortSpans(Spans span, Map<String, List<Spans>> spanTree, List<Spans> sortedSpans) {
  sortedSpans.add(span);
  List<Spans> childSpans = spanTree.get(span.getSpanId());
  if (childSpans != null) {
    for (Spans childSpan : childSpans) {
      sortSpans(childSpan, spanTree, sortedSpans);
    }
  }
}

// Method to merge spans with the same traceId
public List<TraceDTO> mergeTraces(List<TraceDTO> traces) {
  Map<String, TraceDTO> traceMap = new HashMap<>();

  for (TraceDTO trace : traces) {
    String traceId = trace.getTraceId();

    if (traceMap.containsKey(traceId)) {
      System.out.println("CONTAINES SAME------------------------------------------------ " + traceId);
      TraceDTO existingTrace = traceMap.get(traceId);
      existingTrace.getSpans().addAll(trace.getSpans());
    } else {
      traceMap.put(traceId, trace);
    }
  }
  return new ArrayList<>(traceMap.values());
}





public List<TraceMetrics> getAllTraceMetricCount(List<String> serviceNameList, LocalDate from, LocalDate to, int minutesAgo) {
  Instant fromInstant;
  Instant toInstant;

  if (from != null && to != null) {
      fromInstant = from.atStartOfDay(ZoneId.systemDefault()).toInstant();
      toInstant = to.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();
  } else if (minutesAgo > 0) {
      Instant currentInstant = Instant.now();
      Instant minutesAgoInstant = currentInstant.minus(minutesAgo, ChronoUnit.MINUTES);
      fromInstant = minutesAgoInstant;
      toInstant = currentInstant;
  } else {
      // Use the current date for both from and to
      fromInstant = LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant();
      toInstant = LocalDate.now().plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();
  }

  List<TraceDTO> traceList = getTraceDataSince(from, to, minutesAgo);

  Map<String, TraceMetrics> metricsMap = new HashMap<>();

  for (TraceDTO trace : traceList) {
      Date traceCreateTime = trace.getCreatedTime();
      System.out.println("Trace Create Time: " + traceCreateTime);

      if (traceCreateTime != null && serviceNameList.contains(trace.getServiceName())) {
          String serviceName = trace.getServiceName();

          TraceMetrics metrics = metricsMap.get(serviceName);
          if (metrics == null) {
              metrics = new TraceMetrics();
              metrics.setServiceName(serviceName);
              metrics.setApiCallCount(0L);
              metrics.setTotalErrorCalls(0L);
              metrics.setTotalSuccessCalls(0L);
              metrics.setPeakLatency(0L);
          }
          metrics.setApiCallCount(metrics.getApiCallCount() + 1);
          metricsMap.put(serviceName, metrics);
      }
  }

  Instant fromDate = fromInstant.atZone(ZoneId.systemDefault()).toLocalDate().atStartOfDay(ZoneId.systemDefault()).toInstant();
  Instant toDate = toInstant.atZone(ZoneId.systemDefault()).toLocalDate().plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();

  Map<String, Long> errorCounts = calculateErrorCountsByService(fromDate, toDate);
  Map<String, Long> successCounts = calculateSuccessCountsByService(fromDate, toDate);
  Map<String, Long> peakLatency = calculatePeakLatencyCountsByService(fromDate, toDate);

  System.out.println("Metrics Map: " + metricsMap);
  System.out.println("Error Counts: " + errorCounts);
  System.out.println("Success Counts: " + successCounts);
  System.out.println("Peak Latency Counts: " + peakLatency);

  for (Map.Entry<String, Long> entry : errorCounts.entrySet()) {
      String serviceName = entry.getKey();
      Long errorCount = entry.getValue();

      // Update the TraceMetrics object in metricsMap
      TraceMetrics metrics = metricsMap.get(serviceName);
      if (metrics != null) {
          metrics.setTotalErrorCalls(errorCount);
      }
  }

  for (Map.Entry<String, Long> entry : successCounts.entrySet()) {
      String serviceName = entry.getKey();
      Long successCount = entry.getValue();

      // Update the TraceMetrics object in metricsMap
      TraceMetrics metrics = metricsMap.get(serviceName);
      if (metrics != null) {
          metrics.setTotalSuccessCalls(successCount);
      }
  }

  for (TraceMetrics metrics : metricsMap.values()) {
      metrics.setApiCallCount(metrics.getTotalErrorCalls() + metrics.getTotalSuccessCalls());
  }

  for (Map.Entry<String, Long> entry : peakLatency.entrySet()) {
      String serviceName = entry.getKey();
      Long peakLatencyCount = entry.getValue();

      // Update the TraceMetrics object in metricsMap with peak latency count
      TraceMetrics metrics = metricsMap.get(serviceName);
      if (metrics != null) {
          metrics.setPeakLatency(peakLatencyCount);
      }
  }

  return new ArrayList<>(metricsMap.values());
}




private List<TraceDTO> getTraceDataSince(LocalDate from, LocalDate to, int minutesAgo) {
  Instant fromInstant;
  Instant toInstant;

  if (from != null && to != null) {
      fromInstant = from.atStartOfDay(ZoneId.systemDefault()).toInstant();
      toInstant = to.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();
  } else if (minutesAgo > 0) {
      Instant currentInstant = Instant.now();
      Instant minutesAgoInstant = currentInstant.minus(minutesAgo, ChronoUnit.MINUTES);
      fromInstant = minutesAgoInstant;
      toInstant = currentInstant;
  } else {
      // Use the current date for both from and to
      fromInstant = LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant();
      toInstant = LocalDate.now().plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();
  }

  return TraceDTO.find("createdTime >= ?1 && createdTime < ?2", fromInstant, toInstant).list();
}



private Map<String, Long> calculateErrorCountsByService(Instant from, Instant to) {
  MongoCollection<Document> traceCollection = mongoClient
          .getDatabase("OtelTrace")
          .getCollection("TraceDTO");

  List<Bson> aggregationStages = new ArrayList<>();
  aggregationStages.add(
          Aggregates.match(
                  Filters.and(
                          Filters.gte("createdTime", Date.from(from)),
                          Filters.lt("createdTime", Date.from(to)),
                          Filters.and(
                                  Filters.gte("statusCode", 400L),
                                  Filters.lte("statusCode", 599L)
                          )
                  )
          )
  );
  aggregationStages.add(
          Aggregates.group("$serviceName", Accumulators.sum("errorCount", 1L))
  );

  AggregateIterable<Document> results = traceCollection.aggregate(
          aggregationStages
  );

  Map<String, Long> errorCounts = new HashMap<>();
  for (Document result : results) {
      String serviceName = result.getString("_id");
      Long count = result.getLong("errorCount");
      errorCounts.put(serviceName, count);
  }

  return errorCounts;
}

private Map<String, Long> calculateSuccessCountsByService(Instant from, Instant to) {
  MongoCollection<Document> traceCollection = mongoClient
          .getDatabase("OtelTrace")
          .getCollection("TraceDTO");

  List<Bson> aggregationStages = new ArrayList<>();
  aggregationStages.add(
          Aggregates.match(
                  Filters.and(
                          Filters.gte("createdTime", Date.from(from)),
                          Filters.lt("createdTime", Date.from(to)),
                          Filters.and(
                                  Filters.gte("statusCode", 200L),
                                  Filters.lte("statusCode", 299L)
                          )
                  )
          )
  );
  aggregationStages.add(
          Aggregates.group("$serviceName", Accumulators.sum("successCount", 1L))
  );

  AggregateIterable<Document> results = traceCollection.aggregate(
          aggregationStages
  );

  Map<String, Long> successCounts = new HashMap<>();
  for (Document result : results) {
      String serviceName = result.getString("_id");
      Long count = result.getLong("successCount");
      successCounts.put(serviceName, count);
  }

  return successCounts;
}

private Map<String, Long> calculatePeakLatencyCountsByService(Instant from, Instant to) {
  MongoCollection<Document> traceCollection = mongoClient
          .getDatabase("OtelTrace")
          .getCollection("TraceDTO");

  List<Bson> aggregationStages = new ArrayList<>();
  aggregationStages.add(
          Aggregates.match(
                  Filters.and(
                          Filters.gte("createdTime", Date.from(from)),
                          Filters.lt("createdTime", Date.from(to)),
                          Filters.gt("duration", 500L)
                  )
          )
  );
  aggregationStages.add(
          Aggregates.group("$serviceName", Accumulators.sum("peakLatency", 1L))
  );

  AggregateIterable<Document> results = traceCollection.aggregate(
          aggregationStages
  );

  Map<String, Long> peakLatency = new HashMap<>();
  for (Document result : results) {
      String serviceName = result.getString("_id");
      Long count = result.getLong("peakLatency");
      peakLatency.put(serviceName, count);
  }

  return peakLatency;
}



}
