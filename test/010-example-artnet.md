The schema is valid, if it

  * is of type `object` and 
  * has properties, where<br/>optional property **host** 
    * is of type `string` , and 
  * optional property **port** 
    * is of type `number` , and 
  * optional property **refresh_rate** 
    * is of type `number` , and 
  * optional property **universe** 
    * is of type `number` , and 
  * optional property **iface** 
    * is of type `string` , and 
  * optional property **map** 
    * is of type `array` and 
    * has items, where every item 
      * is of type `object` and 
      * has properties, where<br/>required property **channel** 
        * is of type `number` and 
        * has a numeric value that 
          * is at least 1 and 
          * is not larger than 512 , and 
      * optional property **node** 
        * is of type `string` , and 
      * optional property **default_value** 
        * is of type `number` and 
        * has a numeric value that 
          * is at least 0 and 
          * is not larger than 255 , and 
      * has no more properties , and 
  * has no more properties 
