package com.zaga.handler.cloudPlatform;

import io.fabric8.openshift.client.OpenShiftClient;
import jakarta.ws.rs.core.Response;


public interface LoginHandler {
    

    OpenShiftClient login(String username, String password, String oauthToken, boolean useOAuthToken, String clusterUrl);

    Response listAllServices(OpenShiftClient authenticatedClient);

    void instrumentDeployment(OpenShiftClient authenticatedClient,String namespace, String deploymentName);

    void unInstrumentDeployment(OpenShiftClient authenticatedClient,String namespace, String deploymentName);

    String logout(OpenShiftClient authenticatedClient);
}

