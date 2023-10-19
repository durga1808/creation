package com.zaga.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.mongodb.client.MongoClient;
import com.zaga.entity.queryentity.log.LogDTO;
import com.zaga.entity.queryentity.log.LogMetrics;
import com.zaga.entity.queryentity.log.LogQuery;
import com.zaga.handler.LogQueryHandler;
import com.zaga.repo.LogQueryRepo;

import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/logs")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class LogController {
    
    @Inject
    LogQueryRepo repo;

    @Inject
    LogQueryHandler logQueryHandler;

    @Inject
    MongoClient mongoClient;

@GET
@Path("/getAllDataByServiceName")
public Response getAllDataByServiceName(
    @QueryParam("page") @DefaultValue("1") int page,
    @QueryParam("pageSize") @DefaultValue("10") int pageSize,
    @QueryParam("serviceName") String serviceName) {

    try {
        List<LogDTO> logRecords = logQueryHandler.getLogsByServiceName(serviceName, page, pageSize);
        
        long totalCount = logQueryHandler.getTotalLogCountByServiceName(serviceName);

        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode jsonResponse = objectMapper.createObjectNode();
        jsonResponse.put("totalCount", totalCount);
        jsonResponse.set("data", objectMapper.valueToTree(logRecords));

        String responseJson = objectMapper.writeValueAsString(jsonResponse);
        
        return Response.ok(responseJson).build();
    } catch (Exception e) {
        return Response
            .status(Response.Status.INTERNAL_SERVER_ERROR)
            .entity(e.getMessage())
            .build();
    }
}


    @GET
    @Path("/getAllLogDataByPagination")
    public Response getAllLogDataByPagination(
        
        @QueryParam("page") int page,  @QueryParam("pageSize") int pageSize) {
        try {
            long totalCount = logQueryHandler.countLogRecords(); // Use the new method.

            List<LogDTO> logData = logQueryHandler.findLogDataPaged(page, pageSize);

            Map<String, Object> jsonResponse = new HashMap<>();
            jsonResponse.put("totalCount", totalCount);
            jsonResponse.put("data", logData);

            ObjectMapper objectMapper = new ObjectMapper();
            String responseJson = objectMapper.writeValueAsString(jsonResponse);

            return Response.ok(responseJson).build();
        } catch (Exception e) {
            return Response
                .status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity(e.getMessage())
                .build();
        }

    }
       
   
    

    
    @GET
    @Path("/findByTraceId")
    public Response findByTraceId(@QueryParam("traceId") String traceId) {
        if (traceId == null || traceId.isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity("traceId query parameter is required")
                .build();
        }
    List<LogDTO> data = repo.find("traceId=?1", traceId).list();
    if (data.isEmpty()) {
        // Return an empty array if no LogDTO is found
        return Response.ok(new ArrayList<>()).build();
    }

    try {
        ObjectMapper objectMapper = new ObjectMapper();
        String responseJson = objectMapper.writeValueAsString(data);

        return Response.ok(responseJson).build();
    } catch (Exception e) {
        return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity("Error converting response to JSON")
                .build();
    }
}




@GET
@Path("/LogSummaryChartDataCount")
@Produces(MediaType.APPLICATION_JSON)
public List<LogMetrics> getLogMetricsCount(
    @QueryParam("from") LocalDate from,
    @QueryParam("to") LocalDate to,
    @QueryParam("serviceNameList") List<String> serviceNameList,
    @QueryParam("minutesAgo") int minutesAgo
) {
    return logQueryHandler.getLogMetricCount(serviceNameList, from, to, minutesAgo);
}




@GET
@Path("/getallLogdata-sortorder")
@Produces(MediaType.APPLICATION_JSON)
public Response sortOrderTrace(
        @QueryParam("sortOrder") String sortOrder,
        @QueryParam("page") int page,
        @QueryParam("pageSize") int pageSize,
        @QueryParam("startDate") LocalDate from,
        @QueryParam("endDate") LocalDate to,
        @QueryParam("minutesAgo") int minutesAgo,
        @QueryParam("serviceNameList") List<String> serviceNameList) {

    if (page <= 0 || pageSize <= 0) {
        return Response.status(Response.Status.BAD_REQUEST)
                .entity("Invalid page or pageSize parameters.")
                .build();
    }

    try {
        List<LogDTO> logs;

        if ("new".equalsIgnoreCase(sortOrder)) {
            logs = logQueryHandler.getAllLogssOrderByCreatedTimeDesc(serviceNameList);
        } else if ("old".equalsIgnoreCase(sortOrder)) {
            logs = logQueryHandler.getAllLogssAsc(serviceNameList);
        } else if ("error".equalsIgnoreCase(sortOrder)) {
            logs = logQueryHandler.getErrorLogsByServiceNamesOrderBySeverityAndCreatedTimeDesc(serviceNameList);
        } else {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Invalid sortOrder parameter. Use 'new', 'old', or 'error'.")
                    .build();
        }

        // Filter logs within the specified date range or based on minutes ago
        logs = logs.stream()
                .filter(log -> isWithinDateRange(log.getCreatedTime(), from, to, minutesAgo))
                .collect(Collectors.toList());

        int startIndex = (page - 1) * pageSize;
        int endIndex = Math.min(startIndex + pageSize, logs.size());

        if (startIndex >= endIndex || logs.isEmpty()) {
            Map<String, Object> emptyResponse = new HashMap<>();
            emptyResponse.put("data", Collections.emptyList());
            emptyResponse.put("totalCount", 0);

            return buildResponse(emptyResponse);
        }

        List<LogDTO> paginatedTraces = logs.subList(startIndex, endIndex);
        int totalCount = logs.size();

        Map<String, Object> response = new HashMap<>();
        response.put("data", paginatedTraces);
        response.put("totalCount", totalCount);

        return buildResponse(response);
    } catch (DateTimeParseException e) {
        return Response.status(Response.Status.BAD_REQUEST)
                .entity("Invalid date format. Please use ISO_LOCAL_DATE format.")
                .build();
    }
}


private boolean isWithinDateRange(Date logTimestamp, LocalDate from, LocalDate to, int minutesAgo) {
    if (from != null && to != null) {
        LocalDateTime fromDateTime = from.atStartOfDay();
        LocalDateTime toDateTime = to.plusDays(1).atStartOfDay();
        return isWithinDateRange(logTimestamp, fromDateTime, toDateTime);
    } else if (minutesAgo > 0) {
        LocalDateTime currentDateTime = LocalDateTime.now();
        LocalDateTime fromDateTime = currentDateTime.minusMinutes(minutesAgo);
        return isWithinDateRange(logTimestamp, fromDateTime, currentDateTime);
    }
    return true;
}


private boolean isWithinDateRange(Date logTimestamp, LocalDateTime from, LocalDateTime to) {
    LocalDateTime logDateTime = logTimestamp.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();

    return (logDateTime.isEqual(from) || logDateTime.isAfter(from)) &&
            (logDateTime.isEqual(to) || logDateTime.isBefore(to));
}






@POST
@Path("/filterLogs")
@Consumes("application/json")
@Produces("application/json")
public Response filterLogs(
        LogQuery logQuery,
        @QueryParam("page") @DefaultValue("1") int page,
        @QueryParam("pageSize") @DefaultValue("10") int pageSize,
        @QueryParam("startDate") LocalDate from,
        @QueryParam("endDate") LocalDate to,
        @QueryParam("minutesAgo") int minutesAgo) {

    if (page <= 0 || pageSize <= 0) {
        return Response.status(Response.Status.BAD_REQUEST)
                .entity("Invalid page or pageSize parameters.")
                .build();
    }

    try {
        List<LogDTO> logs = logQueryHandler.searchLogByDate(logQuery, from, to, minutesAgo);

        int startIndex = (page - 1) * pageSize;
        int endIndex = Math.min(startIndex + pageSize, logs.size());

        if (startIndex >= endIndex || logs.isEmpty()) {
            Map<String, Object> emptyResponse = new HashMap<>();
            emptyResponse.put("data", Collections.emptyList());
            emptyResponse.put("totalCount", 0);

            return buildResponse(emptyResponse);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("data", logs.subList(startIndex, endIndex));
        response.put("totalCount", logs.size());

        return buildResponse(response); 
    } catch (DateTimeParseException e) {
        return Response.status(Response.Status.BAD_REQUEST)
                .entity("Invalid date format. Please use ISO_LOCAL_DATE format.")
                .build();
    }
}


private Response buildResponse(Map<String, Object> responseData) {
    try {
        ObjectMapper objectMapper = new ObjectMapper();
        String responseJson = objectMapper.writeValueAsString(responseData);

        return Response.ok(responseJson).build();
    } catch (JsonProcessingException e) {
        return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity("Error converting response to JSON")
                .build();
    }
}


    @GET
    @Path("/getErroredLogDataForLastTwo")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getErroredLogDataForLastTwo(
            @QueryParam("page") @DefaultValue("1") int page,
            @QueryParam("pageSize") @DefaultValue("10") int pageSize,
            @QueryParam("serviceName") String serviceName) {

        try {
            List<LogDTO> logList = logQueryHandler.findByMatching(serviceName);

            int totalCount = logList.size();
            int startIndex = (page - 1) * pageSize;
            int endIndex = Math.min(startIndex + pageSize, totalCount);

            if (startIndex >= endIndex || logList.isEmpty()) {
                Map<String, Object> emptyResponse = new HashMap<>();
                emptyResponse.put("data", Collections.emptyList());
                emptyResponse.put("totalCount", 0);

                return Response.ok(emptyResponse).build();
            }

            List<LogDTO> paginatedLogs = logList.subList(startIndex, endIndex);

            Map<String, Object> response = new HashMap<>();
            response.put("data", paginatedLogs);
            response.put("totalCount", totalCount);

            ObjectMapper objectMapper = new ObjectMapper();
            String responseJson = objectMapper.writeValueAsString(response);
      
            return Response.ok(responseJson).build();
          } catch (Exception e) {
            return Response
                .status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity(e.getMessage())
                .build();
          }
    }



@GET
@Path("/searchFunction")
public Response searchLogs(
        @QueryParam("page") @DefaultValue("1") int page,
        @QueryParam("pageSize") @DefaultValue("10") int pageSize,
        @QueryParam("keyword") String keyword,
        @QueryParam("startDate") LocalDate from,
        @QueryParam("endDate") LocalDate to,
        @QueryParam("minutesAgo") int minutesAgo) {

    try {
        List<LogDTO> logList = logQueryHandler.searchLogs(keyword);

        if (from != null && to != null) {
            logList = filterLogsByDateRange(logList, from, to);
        } else if (minutesAgo > 0) {
            logList = filterLogsByMinutesAgo(logList, minutesAgo);
        }

        int totalCount = logList.size();
        int startIndex = (page - 1) * pageSize;
        int endIndex = Math.min(startIndex + pageSize, totalCount);

        if (startIndex >= endIndex || logList.isEmpty()) {
            Map<String, Object> emptyResponse = new HashMap<>();
            emptyResponse.put("data", Collections.emptyList());
            emptyResponse.put("totalCount", 0);

            return Response.ok(emptyResponse).build();
        }

        List<LogDTO> paginatedLogs = logList.subList(startIndex, endIndex);

        Map<String, Object> response = new HashMap<>();
        response.put("data", paginatedLogs);
        response.put("totalCount", totalCount);

        ObjectMapper objectMapper = new ObjectMapper();
        String responseJson = objectMapper.writeValueAsString(response);

        return Response.ok(responseJson).build();
    } catch (Exception e) {
        return Response
                .status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity(e.getMessage())
                .build();
    }
}


private List<LogDTO> filterLogsByDateRange(List<LogDTO> logs, LocalDate from, LocalDate to) {
    return logs.stream()
            .filter(log -> isWithinDateRange(log.getCreatedTime(), from.atStartOfDay(), to.plusDays(1).atStartOfDay()))
            .collect(Collectors.toList());
}


private List<LogDTO> filterLogsByMinutesAgo(List<LogDTO> logs, int minutesAgo) {
    LocalDateTime currentDateTime = LocalDateTime.now();
    LocalDateTime fromDateTime = currentDateTime.minusMinutes(minutesAgo);

    return logs.stream()
            .filter(log -> isWithinDateRange(log.getCreatedTime(), fromDateTime, currentDateTime))
            .collect(Collectors.toList());
}


}