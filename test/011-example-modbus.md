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
        * is of type `number` , and 
    * property **map** 
      * is of type `array` and 
      * has *tabs* format and 
      * has items, where every item 
        * is of type `object` and 
        * has properties, where<br/>optional property **node** 
          * is of type `string` , and 
        * required property **id** 
          * is of type `number` and 
          * has a numeric value that 
            * is at least 0 , and 
        * required property **address** 
          * is of type `number` and 
          * has a numeric value that 
            * is at least 0 , and 
        * optional property **type** 
          * is `input boolean` or 
          * is `input register` or 
          * is `output boolen` or 
          * is `output register` , and 
        * required property **datatype** 
          * is `boolean` or 
          * is `uint16` , and 
        * optional property **metadata** 
          * is of type `object` 
  * or 
    * has properties, where<br/>property **connect_type** 
      * is `TCP` or 
      * is `Telnet` , and 
    * property **connect_path** 
      * is of type `string` , and 
    * property **connect_options** 
      * is of type `object` and 
      * has properties, where<br/>property **port** 
        * is of type `number` , and 
    * property **map** 
      * is of type `array` and 
      * has *tabs* format and 
      * has items, where every item 
        * is of type `object` and 
        * has properties, where<br/>optional property **node** 
          * is of type `string` , and 
        * required property **id** 
          * is of type `number` and 
          * has a numeric value that 
            * is at least 0 , and 
        * required property **address** 
          * is of type `number` and 
          * has a numeric value that 
            * is at least 0 , and 
        * optional property **type** 
          * is `input boolean` or 
          * is `input register` or 
          * is `output boolen` or 
          * is `output register` , and 
        * required property **datatype** 
          * is `boolean` or 
          * is `uint16` , and 
        * optional property **metadata** 
          * is of type `object` 
