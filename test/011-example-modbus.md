The schema is valid, if it

  * is of type `object` and 
  * either 
    * has properties, where<br/>property **connect_type** 
      * is `RTU` or 
      * is `C701` or 
      * is `RTUBuffered` or 
      * is `AsciiSerial` , and 
    * property **connect_path** 
      * is of type `string` , and 
    * property **connect_options** 
      * is of type `object` and 
      * has properties, where<br/>property **baudRate** 
        * is of type `number` 
  * or 
    * has properties, where<br/>property **connect_type** 
      * is `TCP` or 
      * is `Telnet` , and 
    * property **connect_path** 
      * is of type `string` , and 
    * property **connect_options** 
      * is of type `object` and 
      * has properties, where<br/>property **port** 
        * is of type `number` 
