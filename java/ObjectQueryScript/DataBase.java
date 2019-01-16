/**
 * @author Joseph Evans
 * @file   This is the database class that's used in OQS.
 */
package ObjectQueryScript;

import java.util.ArrayList;
import ObjectQueryScript.Table;


public class DataBase {
  private String name;
  private ArrayList<Table> tables;
  private int size;

  public DataBase (String name) {
    this.name = name;
    this.tables = new ArrayList();
    this.size = 0;
  }
}
