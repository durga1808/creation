FROM nginxinc/nginx-unprivileged

USER root

COPY ./build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN     chown -R nginx:nginx /var/cache/nginx && \
        chown -R nginx:nginx /var/log/nginx && \
        chown -R nginx:nginx /etc/nginx/conf.d

RUN     touch /var/run/nginx.pid && \
        chown -R nginx:nginx /var/run/nginx.pid
USER nginx

EXPOSE 8080

CMD ["nginx","-g","daemon off;"]


# docker build --build-arg REACT_APP_APIURL_LOGS=http://otel-extraction.opentelemetry-workspace.svc.cluster.local:8083/logs --build-arg REACT_APP_APIURL_TRACES=http://otel-extraction.opentelemetry-workspace.svc.cluster.local:8083/trace  --build-arg REACT_APP_APIURL_METRICS=http://otel-extraction.opentelemetry-workspace.svc.cluster.local:8083/metrics  --build-arg REACT_APP_APIURL_METRICS_WS=ws://otel-extraction.opentelemetry-workspace.svc.cluster.local:8083/websocket  -t mugicoder13/otel-dashboard .

# docker build -t mugicoder13/otel-dashboard .

# docker push mugicoder13/otel-dashboard