import Password from "../api/password";
import User from "../api/user";
import * as urlParser from "../services/url-parser";
import * as types from "./mutation-types";

export const refreshToken = ({ commit, state }) => {
  const token = state.token;
  if (token) {
    User.requestNewToken({ token }, { baseURL: state.baseURL })
      .then(newToken => commit(types.SET_TOKEN, { token: newToken }))
      .catch(() => commit(types.LOGOUT));
  }
};

export const saveDefaultOptions = ({ commit }, payload) => {
  commit(types.SET_DEFAULT_OPTIONS, payload);
};

export const loadBestPasswordProfile = ({ commit }) => {
  urlParser.getSite().then(site => {
    commit(types.LOAD_PASSWORD_PROFILE, { site });
  });
};

export const getPasswordFromUrlQuery = ({ commit }, { query }) => {
  if (Object.keys(query).length >= 9) {
    const password = urlParser.getPasswordFromUrlQuery(query);
    commit(types.SET_PASSWORD, { password });
  }
};

export const savePassword = ({ commit }, payload) => {
  commit(types.SET_PASSWORD, payload);
};

export const saveVersion = ({ commit }, payload) => {
  commit(types.SET_VERSION, payload);
};

export const getSite = ({ commit }) => {
  urlParser.getSite().then(site => {
    if (site) {
      commit(types.SET_SITE, { site });
    }
  });
};

export const login = ({ commit }, payload) => {
  commit(types.SET_BASE_URL, payload);
  commit(types.SET_TOKEN, payload);
  commit(types.LOGIN);
};

export const logout = ({ commit }) => {
  commit(types.LOGOUT);
};

export const getPasswords = ({ commit, state }) => {
  if (state.authenticated) {
    return Password.all(state).then(response => {
      const passwords = response.data.results;
      commit(types.SET_PASSWORDS, { passwords });
      return passwords;
    });
  }
  return Promise.resolve([]);
};

export const saveOrUpdatePassword = ({ commit, state }) => {
  if (state.password && typeof state.password.id === "undefined") {
    const site = state.password.site;
    const login = state.password.login;
    if (site || login) {
      Password.create(state.password, state).then(response => {
        savePassword({ commit }, { password: response.data });
        getPasswords({ commit, state });
      });
    }
  } else {
    Password.update(state.password, state).then(() => {
      getPasswords({ commit, state });
    });
  }
};

export const deletePassword = ({ commit, state }, payload) => {
  Password.delete(payload, state).then(() => {
    commit(types.DELETE_PASSWORD, payload);
  });
};

export const displayMessage = ({ commit }, payload) => {
  commit(types.SET_MESSAGE, payload);
};

export const cleanMessage = ({ commit }) => {
  commit(types.CLEAN_MESSAGE);
};
