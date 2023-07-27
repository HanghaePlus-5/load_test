"use strict";

const uuidv4 = require("uuid").v4;

module.exports = {
  extractTokenFromCookie,
  logResponse,
  generateUUID,
  saveOrderBody,
  generateRandom
};

function extractTokenFromCookie(requestParams, response, context, ee, next) {
  console.log("accessToken start  ", response.headers["set-cookie"]);

  if (response.headers["set-cookie"]) {
    response.headers["set-cookie"].forEach(function (cookies) {
      cookies.split(";").forEach(function (cookie) {
        if (cookie.trim().startsWith("accessToken=")) {
          context.vars.accessToken = cookie.trim().split("=")[1];
          console.log("accessToken : ", context.vars.accessToken);
        }
      });
    });
  }
  return next();
}

function generateUUID(userContext, events, done) {
  const uuid = uuidv4();
  const uuidSplit = uuid.split("-")[0];
  userContext.vars.uuid = uuidSplit;
  userContext.vars.name = uuidSplit;
  userContext.vars.email = `${uuidSplit}@naver.com`;
  return done();
}
function generateRandom(requestParams, response, context, ee, next) {
  context.vars.ran = Math.floor(Math.random() * 4)+1
  return next();
}

function logResponse(requestParams, response, context, ee, next) {
  console.log("Response headers:", response.headers);
  console.log("Response body:", response.body);
  return next();
}
function saveOrderBody(requestParams, res, context, ee, next) {
  const body = JSON.parse(res.body);
  const data = body.data;
  const dataLength = data.length;
  const store = data[Math.floor(Math.random() * dataLength)];
  const orderItem = [];

  for (const menu of store.menus) {
    if (orderItem.length === 0) {
      orderItem.push({
        menuId: menu.menuId,
        quantity: Math.floor(Math.random() * 10) + 1,
      });
    } else {
      if (Math.random() < 0.3) continue;

      orderItem.push({
        menuId: menu.menuId,
        quantity: Math.floor(Math.random() * 10) + 1,
      });
    }
  }

  const order = {
    storeId: store.storeId,
    orderItem,
  };
  context.vars.order = order;
  console.log("orderBody", context.vars.order);
  return next();
}
