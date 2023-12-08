class Definer {
  //general errors
  static general_err1 = "att: something went wrong!";
  static general_err2 = "att: there is no data with that params!";
  static general_err3 = "att: file upload error!";

  // member auth realated errors
  static auth_err1 = "att: mongoDB validation failed!";
  static auth_err2 = "att: jwt token creation error";
  static auth_err3 = "att: there is no member with mb_nick name!";
  static auth_err4 = "att: password is incorrect!";
  static auth_err5 = "att: you are not authenticated";

  // product related errors
  static product_err1 = "att: product creation failed!";

  //order related errors
  static order_err1 = "att: order creation failed!";
}

module.exports = Definer;
