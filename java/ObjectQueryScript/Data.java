/**
 * @author Joseph Evans
 * @file   This is the data class that's used in OQS.
 */
package ObjectQueryScript;

public class Data {
  private String name;
  private String value;

  public Data () {
    this.name = "";
    this.value = "";
  }

  public Data (String name) {
    if (name != null && !name.isEmpty()) {
      this.name = name;
    } else {
      this.name = "";
    }

    this.key = "";
  }

  public Data (String name, String value) {
    if (name != null && !name.isEmpty()) {
      this.name = name;
    } else {
      this.name = "";
    }

    if (value != null && !value.isEmpty()) {
      this.value = value;
    } else {
      this.value = "";
    }
  }

  public String getName () {
    return this.name;
  }

  public String getValue () {
    return this.value;
  }

  public void setName (String name) {
    if (name != null && !name.isEmpty()) {
      this.name = name;
    } else if (this.name == null || this.name.isEmpty()) {
      this.name = "";
    }
  }

  public void setValue (String value) {
    if (value != null && !value.isEmpty()) {
      this.value = value;
    } else if (this.value == null || this.value.isEmpty()) {
      this.value = "";
    }
  }
}
