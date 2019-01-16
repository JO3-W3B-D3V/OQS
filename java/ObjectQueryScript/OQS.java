/**
 * @author Joseph Evans
 * @file   This is the core feature of OQS.
 *
 * @todo  Include a while loop as the 'setInterval',
 *        and thread sleep for the so called pause.
 */
package ObjectQueryScript;

 class OQS {
     private static OQS instance;

     private OQS () {

     }

     public static OQS getInstance() {
         if (OQS.instance == null) {
             OQS.instance = new OQS();
         }

         return OQS;
     }
}
