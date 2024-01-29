import axios from "axios";
const openshiftLoginURL = process.env.REACT_APP_APIURL_OPENSHIFT;

export const getClusterListAllProjects = async () => {
  try {
    const response = await axios.get(`${openshiftLoginURL}/listAllProjects`);

    console.log("getClusterListAllProjects", response);

    return response.data;
  } catch (error) {
    console.error("Error in getClusterListAllProjects:", error);
    throw error;
  }
};

export const changeToInstrument = async (namespace, deploymentName) => {
  try {
    const response = await axios.post(
      `${openshiftLoginURL}/instrument/${namespace}/${deploymentName}`
    );

    console.log("response", response);

    return response;
  } catch (error) {
    console.error("Error in changeToInstrument:", error);
    throw error;
  }
};

export const changeToUninstrument = async (namespace, deploymentName) => {
  try {
    const response = await axios.post(
      `${openshiftLoginURL}/unInstrument/${namespace}/${deploymentName}`
    );

    console.log("response", response);

    return response;
  } catch (error) {
    console.error("Error in changeToUninstrument:", error);
    throw error;
  }
};
