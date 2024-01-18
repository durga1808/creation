import axios from 'axios';

const loginURL = process.env.REACT_APP_APIURL_AUTH;
const CLIENT_SECRET = process.env.REACT_APP_APIURL_CLIENT_SECRET
const SSO_BASE_URL = process.env.REACT_APP_APIURL_SSO;
const CLIENT_ID = "react-auth";
const GRANT_TYPE = "password";
const openshiftLoginURL = process.env.REACT_APP_APIURL_OPENSHIFT

export const keycloakLoginAuth = async (userAuth) => {
    const data = new URLSearchParams();
    data.append('client_id', CLIENT_ID);
    data.append('grant_type', GRANT_TYPE);
    data.append('client_secret', CLIENT_SECRET);
    data.append('username', userAuth.username);
    data.append('password', userAuth.password);

    try {
        const keycloakInstance = await axios.post(`${SSO_BASE_URL}/token`, data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                // 'Access-Control-Allow-Origin': '*',
                // 'Access-Control-Allow-Credentials': true,
                // 'Access-Control-Allow-Headers': "*"

            },
        });
        return { data: keycloakInstance.data, error: null }; // Return the response or perform further actions as needed
    } catch (error) {
        console.error('Token request error:', error);
        return { data: null, error: error }; // Throw the error or handle it appropriately
    }
};

export const keycloakLogoutAuth = async () => {
    const data = new URLSearchParams();
    data.append('client_id', CLIENT_ID);
    data.append('refresh_token', localStorage.getItem("refreshToken"));
    data.append('client_secret', CLIENT_SECRET);

    try {
        const keycloakInstance = await axios.post(`${SSO_BASE_URL}/logout`, data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        return { data: keycloakInstance.data, error: null }; // Return the response or perform further actions as needed
    } catch (error) {
        console.error('Token request error:', error);
        return { data: null, error: error }; // Throw the error or handle it appropriately
    }
};

export const loginUser = async (data) => {
    try {
        console.log("api call data", data);
        const response = await axios.post(`${loginURL}/login`, data);
        return response;
    } catch (error) {
        console.error("Error in login User:", error);
        return error;
    }
};

export const getServiceList = async (userInfo) => {
  try {
    console.log("api call data", userInfo);
    const response = await axios.post(`${loginURL}/getServiceList`, userInfo);
    return response.data;
  } catch (error) {
    console.error("Error in getServiceList:", error);
    throw error;
  }
};

export const addRulesForService = async (addRules) => {
    try {
        console.log("api call data", addRules);
        const response = await axios.post(`${loginURL}/addServiceListNew`, addRules);
        return response.data;
    }
    catch (error) {
        console.error("Error in login User:", error);
        throw error;
    }
}

export const addClusterDetails = async (Cluster) => {
  try {
    console.log("cluster api data", JSON.stringify(Cluster));
    // const data=JSON.stringify(Cluster);
    const response = await axios.post(`${loginURL}/register`, Cluster);

    return response.data; 
  } catch (error) {
    console.error("Error in add Cluster User:", error);
    throw error;
  }
};


export const updateClusterDetails = async (UpdatedClusterData) => {
  try {
    console.log("updatedcluster api data", JSON.stringify(UpdatedClusterData));
    // const data=JSON.stringify(Cluster);
    const response = await axios.put(`${loginURL}/clusterDataUpdate`, UpdatedClusterData);

    return response.data;
  } catch (error) {
    console.error("Error in update Cluster User:", error);
    throw error;
  }
};


export const getClusterDetails = async () => {
  try {
    const response = await axios.get(`${loginURL}/register`);

    console.log("response", response);
    return response.data;
  } catch (error) {
    console.error("Error in get cluster User:", error);
    throw error;
  }
};

export const openshiftClusterLogin = async (clusterUrl,password,username) => {
  try {

    console.log("clusterUrl",clusterUrl);
    const response = await axios.get(`${openshiftLoginURL}?clusterUrl=${clusterUrl}&password=${password}&username=${username}`);

    console.log("response", response);
   
    return response.data;
  } catch (error) {
    console.error("Error in get openshiftClusterLogin User:", error);
    throw error;
  }
};
