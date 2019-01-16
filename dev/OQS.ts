/**
 * @author    Joseph Evans <joeevs196@gmail.com>
 * @since     02/10/2018
 * @version   1.0.5
 * @file      The purpose of this code is to allow you to execute
 *            some JavaScript code on some data set which is meant to
 *            be an array of objects. In theory, this could be used as
 *            an alternative method to querying the database, as it takes
 *            time just to connect, but that said, this method is of course
 *            bound to be slower. This is essentially an ideal tool to use
 *            when you'd like to query a small-mid sized data set, this
 *            code is capable of querying large data set's, however it's
 *            not ideal, nor would I advise to use this solution for large
 *            data sets. The real beauty behind this code is that it can be
 *            used either server side or client side, or both if necessary.
 *            I've implemented this solution using TypeScript to make the code
 *            naturally more readable, not to mention how it implemented OOP
 *            practices quite nicely, etc.
 * @todo      Complete the documentation.
 * @todo      Review general structure of solution.
 * @todo      Complete the solution.
 * @todo      Implement some form of join(s).
 * @todo      Implement the ability to clone a table from one database to another.
 * @todo      Implement some form of sting cleansing.
 * @todo      Etc.
 * @see       https://www.typescriptlang.org/play/index.html
 * @see       https://jscompress.com/
 * @copyright Joseph Evans (c) 2018
 */


/**
 * @global
 * @interface DataBaseInterface
 * @desc      This is here to illustrate the logical structure
 *            that's used for the database objects in the code
 *            below.
 */
/* export  */interface DataBaseInterface
{
  name   : String,
  tables : Object
}

/**
 * @global
 * @interface TableInterface
 * @desc      This is here to illustrate the logical structure
 *            that's used for the table objects in the code below.
 */
/* export  */interface TableInterface
{
  name    : String,
  size    : Number,
  cols    : Array<String>,
  records : Array<Object>
}

/**
 * @global
 * @class ObjectQuery
 * @desc  The purpose of this class is to simply execute SQL like logic
 *        on some data set.
 */
/* export  */class ObjectQuery
{
  /**
   * @private
   * @property instance
   * @type     ObjectQuery
   * @desc     This is the one instance that we'd like to
   *           return.
   */
  private static instance : ObjectQuery;

  /**
   * @private
   * @property minimalCap
   * @type     Number
   * @desc     The purpose of this property is to ensure that a
   *           minimal number of records are processed.
   */
  private static minimalCap : Number;

  /**
   * @private
   * @property cap
   * @type     Number
   * @desc     This is the cap that you'd like to set in regards to
   *           the number of records you'd like to query per interval.
   */
  private static cap : Number;

  /**
   * @private
   * @property _orderby
   * @type     String
   * @desc     This is the order by logic.
   */
  private _orderby  : String;

  /**
   * @private
   * @property _order
   * @type     String
   * @desc     The purpose of this property is to simply state
   *           which order you would like to order the results by.
   *           The default order will be ascending order.
   */
  private _order : String = 'asc';

  /**
   * @private
   * @property _where
   * @type     String
   * @desc     This is essentially the where clause.
   */
  private _where    : String;

  /**
   * @private
   * @property _from
   * @type     String
   * @desc     This is essentially the from clause.
   */
  private _from     : String;

  /**
   * @privae
   * @property _offset
   * @type     Number
   * @desc     This is essentially the offset clause.
   */
  private _offset    : Number;

  /**
   * @private
   * @property _index
   * @type     Number
   * @desc     This is the index for stating the progression
   *           of the query, and example being how we may wish to
   *           break out of a loop so that the set interval
   *           method can do it's magic, and not block the main
   *           execution thread.
   */
  private _index     : Number;

  /**
   * @private
   * @property _count
   * @type     Number
   * @desc     This is the maximum number of records that you may
   *           wish to query per interval.
   */
  private _count     : Number;

  /**
   * @privae
   * @property _limit
   * @type     Number
   * @desc     This is essentially the limit clause.
   */
  private _limit     : Number;

  /**
   * @private
   * @property cooldown
   * @desc     This is essentially the amount of time you'd like
   *           to delay the query by.
   */
  private cooldown   : Number;

  /**
   * @private
   * @property currentTable
   * @type     *
   * @desc     This is essentially a shortcut so that it's possible
   *           to query this table directly, etc.
   */
  private currentTable : any;

  /**
   * @private
   * @property databases
   * @type     Object
   * @desc     This is essentially a collection of database objects.
   */
  private databases : Object;

  /**
   * @private
   * @property current
   * @type     Object
   * @desc     This acts like a pointer to the currently selected database.
   */
  private current   : Object;

  /**
   * @private
   * @property oncomplete
   * @type     Function
   * @desc     This is the callback function that will be called once the
   *           query has finished.
   */
  private oncomplete : Function;

  /**
   * @private
   * @property oncooldown
   * @type     Function
   * @desc     The purpose of this property is to run some method for each
   *           time the code is in it's cool down state.
   */
  private oncooldown : Function;

  /**
   * @private
   * @property onprogress
   * @type     Function
   * @desc     This is the callback method that you may wish to execute per
   *           interval cool-down.
   */
  private onprogress : Function;

  /**
   * @private
   * @property debug_active
   * @type     Boolean
   * @desc     This is a flag that allows us to hide/see any errors that this
   *           solution may cause.
   */
  private debug_active : Boolean;

  /**
   * @private
   * @property toDelete
   * @type     Boolean
   * @desc     This property is used as a flag to state whether or not the
   *           record should be removed from the relevant table.
   */
  private toDelete : Boolean = false;

  /**
   * @private
   * @property updateCol
   * @type     *
   * @desc     This is the method that you would like to run when you wish
   *           to update a set of records. I've set this to null to simply
   *           allow for the process method to see if this property is set to
   *           null or not, rather than over complicate things.
   */
  private updateCol : any = null;

  /**
   * @private
   * @property updateValue
   * @type     *
   * @desc     This is the value that you'd like to assign to the update column.
   */
  private updateValue : any = '';

  /**
   * @private
   * @property results
   * @type     Array<Object>
   * @desc     This property will be used to store the results that's relevant to
   *           the query.
   */
  private results : Array<Object> = [];

  /**
   * @private
   * @function constructor
   * @desc     The constructor has been set to private
   *           just to force other scripts to use the
   *           'getInstance' method.
   */
  private constructor ()
  {
    let msg : String = '\n\n🤖 – Welcome To OQS - 🤖\n';
    msg += '\n\n... AKA Object Query Script';
    msg += "\nWelcome to object query script, you're a smart developer!";
    msg += "\nYou've decided that you'd like to excute some queries on the client side.";
    msg += "\nThis means that if your back end solution goes down! Hey no worries!";
    msg += "\nThanks to OQS you can query some cached data on the clients device!";
    msg += "\nI hope you enjoy and feel free to drop me an email at joeevs196@gmail.com! 😃";
    msg += "\n\n\n";

    try { console.info(msg); }
    catch (Exception) {
      this.debug(Exception);
      console.log(msg);
    }

    ObjectQuery.cap = 10000;
    ObjectQuery.minimalCap = 10;
    this.cooldown   = 100;

    this._orderby = '';
    this._where = '';
    this._from = '';

    this._offset = 0;
    this._index = 0;
    this._count = 0;
    this._limit = 0;

    this.currentTable = null;

    this.current = {};
    this.databases = {};

    this.oncomplete = () => {};
    this.onprogress = () => {};
    this.oncooldown = () =>{};

    this.debug_active = false;
    this.results = [];

    return this;
  }

  /**
   * @public
   * @function getInstance
   * @return   {ObjectQuery}
   * @desc     The purpose of this method is to simply
   *           return the instance property that's
   *           assigned to this class.
   */
  public static getInstance () : ObjectQuery
  {
    if (ObjectQuery.instance == null)
    {
      ObjectQuery.instance = new ObjectQuery();
    }

    return ObjectQuery.instance;
  }

  /**
   * @public
   * @function toggleDebug
   * @return   {ObjectQuery}
   * @desc     The purpose of this method is to simply
   *           activate the ability to see any errors
   *           produced by this class.
   */
  public toggleDebug () : ObjectQuery
  {
    this.debug_active = !this.debug_active;
    return ObjectQuery.getInstance();
  }

  /**
   * @private
   * @function debug
   * @param    {*} Error
   * @return   {ObjectQuery}
   * @desc     The purpose of this method is to simply
   *           log any errors that this class has produced.
   *
   * @example  try
   *           {
   *             throw new Error('OQS Example');
   *           }
   *
   *           // Now catch the error.
   *           catch (e)
   *           {
   *             this.debug(e);
   *           }
   */
  private debug (Error : any) : ObjectQuery
  {
    if (this.debug)
    {
      console.log('=============');
      console.log('=== ERROR ===');
      console.log(Error);
      console.log('=== ERROR ===');
      console.log('=============');
    }

    return ObjectQuery.getInstance();
  }

  /**
   * @private
   * @function isValidString
   * @param    {String} string
   * @return   {Boolean}
   * @desc     The purpose of this method is to simply
   *           verify that a provided string is relevant.
   *
   * @example  if (this.isValidString('OQS Example')
   *           {
   *             console.log(true);
   *           }
   */
  private isValidString (string : String) : Boolean
  {
    try
    {
      return string.replace(new RegExp(' ', 'g'), '').length > 0;
    }

    catch (Error)
    {
      this.debug(Error);
      return false;
    }
  }

  /**
   * @private
   * @function isSafeString
   * @param    {String} string
   * @return   {Boolean}
   * @desc     The purpose of this method is to simply state if
   *           a string is safe to process or not.
   *
   * @example  if (this.isSafeString('function')) alert("Lies!");
   * @todo
   */
  private static isSafeString (string : String) : boolean
  {
      string = string.toString().toLowerCase().replace(/\ /, '');
    if (string.indexOf('function(') > -1
        || string.indexOf('xmlhttprequest(') > -1
        || string.indexOf('if(') > -1
        || string.indexOf('for(') > -1
        || string.indexOf('{')   > -1
        || string.indexOf('}')   > -1
        //|| string.indexOf('(')   > -1 todo
        //|| string.indexOf(')')   > -1 todo
        || string.indexOf('>')   > -1
        || string.indexOf('<')   > -1
        || string.indexOf('=')   > -1
        || string.indexOf('?')   > -1
    )
    {
        return false;
    }

    return true;
  }

  /**
   * @public
   * @function isValidInt
   * @param    {Number} number
   * @return   {Boolean}
   * @desc     The purpose of this method is to simply return
   *           whether or not a given number is a valid integer
   *           and it's not lower than the capped number and isn't
   *           lower than 0.
   *
   * @example  if (this.isValidInt(9))
   *           {
   *             console.log(true);
   *           }
   */
  private isValidInt (number : Number) : Boolean
  {
    try
    {
      // just make sure that the number is of type int
      number = parseInt(number.toString());
      return number <= ObjectQuery.cap && number > 0;
    }


    catch (Error)
    {
      this.debug(Error);
      return false;
    }
  }

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
// DATABASE RELATED CODE

  /**
   * @public
   * @function getDataBases
   * @return   {Object}
   * @desc     The purpose of this code is to simply return
   *           all of the known databases.
   */
  public getDataBases () : Object
  {
    return this.databases;
  }

  /**
   * @public
   * @function getDatabase
   * @param    {String} name
   * @return   {DataBaseInterface}
   * @desc     The purpose of this method is to simply return a
   *           specific database.
   *
   * @example  const OQS = ObjectQuery.getInstance();
   *           const db = OQS.getDatabase('demo');
   */
  public getDatabase (name : String) : DataBaseInterface
  {
    if (name == null)
    {
      // @ts-ignore
      return this.current;
    }

    if (this.isValidString(name))
    {
      // @ts-ignore
      return this.databases[name];
    }

    // @ts-ignore
    return null;
  }

  /**
   * @public
   * @function createDataBase
   * @param    {String} name
   * @return   {ObjectQuery}
   * @desc     The purpose of this method is to simply allow
   *           you to create a database object which essentially
   *           implements the 'DataBaseInterface' interface.
   *
   * @example  const OQS = ObjectQuery.getInstance();
   *           const db = OQS.createDataBase('demo');
   */
  public createDataBase (name : String) : ObjectQuery
  {
    if (this.getDatabase(name) == null)
    {
      // @ts-ignore
      this.databases[name] = {
        name   : name,
        tables : {}
      };

      // @ts-ignore
      this.current = this.databases[name];
    }

    return ObjectQuery.getInstance();
  }

  /**
   * @public
   * @function selectDatabase
   * @param    {String} name
   * @return   {ObjectQuery}
   * @desc     The purpose of this method is to simply switch
   *           the currently selected database, this method will
   *           not copy the 'getDataBase' method where it'll return
   *           the database. This method will essentially change
   *           a private property that has the name 'current'.
   *
   * @example  const OQS = ObjectQuery.getInstance();
   *           OQS.selectDataBase('demo');
   */
  public selectDataBase (name : String) : ObjectQuery
  {
    if (this.getDatabase(name) != null && name != null)
    {
      this.current = this.getDatabase(name);
    }

    return ObjectQuery.getInstance();
  }

  /**
   * @public
   * @function cloneDataBase
   * @param    {String} name
   * @param    {String} newName
   * @return   ObjectQuery
   * @desc     The purpose of this method is to simply clone one
   *           database and all of it's contents into a new database.
   *
   * @example  const OQS = ObjectQuery.getInstance();
   *           OQS.cloneDataBase('demo', 'clonedDemo');
   */
  public cloneDataBase (name : String, newName : String) : ObjectQuery
  {
    try
    {
      if (this.getDatabase(name) != null && this.getDatabase(newName) == null && this.isValidString(newName)) {
        // @ts-ignore
        this.databases[newName] = JSON.parse(JSON.stringify(this.getDatabase(name)));
      }
    }

    catch (Error)
    {
      this.debug(Error);
    }

    return ObjectQuery.getInstance();
  }

  /**
   * @public
   * @function dropDataBase
   * @param    {String} name
   * @return   {ObjectQuery}
   * @desc     The purpose of this method is to remove one of the
   *           database objects from memory, essentially deleting the
   *           database.
   *
   * @example  const OQS = ObjectQuery.getInstance();
   *           OQS.dropDataBase('demo');
   */
  public dropDataBase (name : String) : ObjectQuery {
    try
    {
      // @ts-ignore
      if (this.current.name == name)
      {
        this.current = {};
      }

      // @ts-ignore
      delete this.databases[name];
    }

    catch (Error)
    {
      this.debug(Error);
    }

    return ObjectQuery.getInstance();
  }

// END OF DATABASE RELATED CODE
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
// TABLE RELATED CODE

  /**
   * @public
   * @function getTables
   * @return   {Object}
   * @desc     The purpose of this method is to simply
   *           return all of the tables from the currently
   *           selected database.
   */
  public getTables () : Object
  {
    try {
      // @ts-ignore
      return this.current.tables;
    }

    catch (Error)
    {
      this.debug(Error);
    }

    // @ts-ignore
    return null;
  }

  /**
   * @public
   * @function getTable
   * @param    {String} name
   * @return   {TableInterface}
   * @desc     The purpose of this method is to simply return a specific table.
   */
  public getTable (name : String) : TableInterface
  {
    try
    {
      if (this.isValidString(name))
      {
        // @ts-ignore
        if (this.current.tables[name] != null)
        {
          // @ts-ignore
          return this.current.tables[name];
        }
      }

      // @ts-ignore
      return null;
    }

    catch (Error)
    {
      this.debug(Error);
    }

    // @ts-ignore
    return null;
  }

  /**
   * @public
   * @function createTable
   * @param    {String} name
   * @return   {ObjectQuery}
   * @desc     The purpose of this method is to simply create a table in
   *           the currently selected database.
   */
  public createTable (name : String) : ObjectQuery
  {
    if (this.isValidString(name) && this.getTable(name) == null)
    {
      const rows    : Number = 0;
      const cols    : Array<String> = [];
      const records : Array<Object> = [];
      const table   : Object = {
        name    : name,
        size    : rows,
        cols    : cols,
        records : records
      };

      // @ts-ignore
      this.current.tables[name] = table;
      this.currentTable = table;
    }

    return ObjectQuery.getInstance();
  }

  /**
   * @public
   * @function cloneTable
   * @param    {String} name
   * @param    {String} newName
   * @return   {ObjectQuery}
   * @desc     The purpose of this method is to simply clone a table
   *           into a new table within the currently selected database.
   */
  public cloneTable (name : String, newName : String) : ObjectQuery
  {
    try
    {
      if (this.getTable(name) != null && this.getTable(newName) == null && this.isValidString(newName))
      {
        const clonedTable : Object = JSON.parse(JSON.stringify(this.getTable(name)));

        // @ts-ignore
        this.current.tables[newName] = clonedTable;
        this.currentTable = clonedTable;
      }
    }

    catch (Error)
    {
      this.debug(Error);
    }

    return ObjectQuery.getInstance();
  }

  /**
   * @public
   * @function dropTable
   * @param    {String} name
   * @return   {ObjectQuery}
   * @desc     The purpose of this method is to simply delete a specific table
   *           from the currently selected database.
   */
  public dropTable (name: String)
  {
    try
    {
      if (this.getTable(name) != null) {
        // @ts-ignore
        const table = this.current.tables[name];

        if (table.name == this.currentTable.name)
        {
          this.currentTable = null;
        }

        // @ts-ignore
        delete this.current.tables[name];
      }
    }

    catch (Error)
    {
      this.debug(Error);
    }

    return ObjectQuery.getInstance();
  }

  /**
   * @public
   * @function getTableSize
   * @return   {Number}
   * @desc     The purpose of this method is to simply return the size
   *           of the currently selected table.
   */
  public getTableSize () : Number
  {
    try {
      if (this.currentTable != null) {
        return this.currentTable.size;
      }

      return 0;
    }


    catch (Error)
    {
      this.debug(Error);
      return 0;
    }
  }

  /**
   * @private
   * @function insertSafely
   * @param    {TableInterface} table
   * @param    {Array<Object>}  data
   * @return   {void}
   * @desc     The purpose of this method is to simply take some table
   *           and verify that the provided data is safe to insert.
   *           This may be slightly computationally complex, however this
   *           does force the ure to follow some form of data structure, which
   *           is kinda the point.
   */
  private static insertSafely (table : TableInterface, data : Array<Object>) : void
  {
    const cols : Array<String> = table.cols;

    for (let i = 0, size = data.length; i < size; i ++)
    {
      const record : Object = data[i];
      let obj    : Object = {};
      let valid  : Boolean = false;

      for (let j = 0, _size = cols.length; j < _size; j++)
      {
        const col : String = cols[j].toString().toLowerCase();

        if (!(col.toString() in record))
        {
          valid = false;
          break;
        }

        // @ts-ignore
        obj[col] = record[col];
        valid = true;
      }

      if (valid)
      {
        table.records.push(obj);
      }
    }

    return void 0;
  }

  /**
   * @public
   * @function insertInto
   * @param    {String} name
   * @param    {Array<Object>} data
   * @desc     The purpose of this method is to simply take some data and
   *           insert it into a specific table.
   */
  public insertInto (name: String, data : Array<Object>) : ObjectQuery
  {
    const table = this.getTable(name);

    if (table != null)
    {
      ObjectQuery.insertSafely(table, data);
    }

    return ObjectQuery.getInstance();
  }

  /**
   * @public
   * @function insert
   * @param    {Array<Object>} data
   * @desc     The purpose of this method is to simply take some data and
   *           insert it into the currently selected table.
   */
  public insert (data : Array<Object>) :  ObjectQuery
  {
    const table = this.currentTable;

    if (table != null)
    {
      ObjectQuery.insertSafely(table, data);
    }

    return ObjectQuery.getInstance();
  }

// END OF TABLE RELATED CODE
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
// LOGIC RELATED CODE

  /**
   * @public
   * @function onProgress
   * @param    {Function} callback
   * @return   {ObjectQuery}
   * @desc     The purpose of this method is to run some code per
   *           interval.
   */
  public onProgress (callback : Function) : ObjectQuery
  {
    this.onprogress = callback;
    return ObjectQuery.getInstance();
  }

  /**
   * @public
   * @function onComplete
   * @param    {Function} callback
   * @return   {ObjectQuery}
   * @desc     The purpose of this method is to simply execute some
   *           callback method once the query has finished.
   */
  public onComplete (callback : Function) : ObjectQuery
  {
    this.oncomplete = callback;
    return ObjectQuery.getInstance();
  }

  /**
   * @public
   * @function onCoolDown
   * @param    {Function} callback
   * @return   {ObjectQuery}
   * @desc     The purpose of this method is to set the on cool
   *           down property.
   */
  public onCoolDown (callback : Function) : ObjectQuery
  {
    this.oncooldown = callback;
    return ObjectQuery.getInstance();
  }

  /**
   * @public
   * @function selectFrom
   * @param    {String} name
   * @return   {ObjectQuery}
   * @desc     The purpose of this method is to essentially state where
   *           you'd like to query the data from, etc.
   */
  public selectFrom (name : String) : ObjectQuery
  {
    const table = this.getTable(name);

    if (table != null)
    {
      this.currentTable = table;
    }

    return ObjectQuery.getInstance();
  }

  /**
   * @public
   * @function where
   * @param    {String} where
   * @return   {ObjectQuery}
   * @desc     The purpose of this method is to simply set the
   *           where clause.
   */
  public where (where : String) : ObjectQuery
  {
    if (this.isValidString(where) && ObjectQuery.isSafeString(where))
    {
      this._where = where;
    }

    return ObjectQuery.getInstance();
  }

  /**
   * @public
   * @function limit
   * @param    {Number} number
   * @return   {ObjectQuery}
   * @desc     The purpose of this method is to simply set the limit
   *           in terms of the max number of results you'd like to see
   *           in the results.
   */
  public limit (number : Number) : ObjectQuery
  {
    //if (this.isValidInt(number))
    //{
      this._limit = number;
    //}

    return ObjectQuery.getInstance();
  }

  /**
   * @public
   * @function setLimiter
   * @return   {ObjectQuery}
   * @desc     The purpose of this method is quite simple, it is to ensure that
   *           the user of this code has the ability to set the limiter property.
   */
  public setLimiter (limiter : Number) : ObjectQuery
  {
    if (limiter <= ObjectQuery.cap && limiter >= ObjectQuery.minimalCap)
    {
      this._count = limiter;
    }

    return ObjectQuery.getInstance();
  }

  /**
   * @public
   * @function offset
   * @param    {Number} number
   * @return   {ObjectQuery}
   * @desc     The purpose of this method is to simply set the offset
   *           with the query, aka where you'd like to start the initial
   *           index from, default is set to 0.
   */
  public offset (number : Number) : ObjectQuery
  {
    if (this.isValidInt(number) && number < this.getTableSize())
    {
      this._offset = number;
    }

    return ObjectQuery.getInstance();
  }

  /**
   * @public
   * @function orderBy
   * @param    {String} orderby
   * @param    {String} order
   * @return   {ObjectQuery}
   * @desc     The purpose of this method is to simply set the order
   *           by property so that when we wish to execute the query
   *           we can order the results.
   */
  public orderBy (orderby : String, order? : String) : ObjectQuery
  {
    if (this.currentTable.cols.indexOf(orderby) > -1)
    {
      this._orderby = orderby;

      if (order == null) { order = ''; }

      const ord = order.toString().toLowerCase().replace(new RegExp(' ', 'g'), '');
      if (ord == 'asc' || ord == 'desc')
      {
        this._order = ord;
      } else { this._order = 'asc'; }
    }

    return ObjectQuery.getInstance();
  }

  /**
   * @todo
   * @public
   * @function delete
   * @return   {ObjectQuery}
   * @desc     The purpose of this method is to simply
   *           state that you would like to remove the
   *           relevant records from the current table.
   */
	public delete () : ObjectQuery
	{
		this.toDelete = true;
		return ObjectQuery.getInstance();
	}

	/**
	 * @todo
	 * @public
	 * @function update
	 * @param    {String} column
	 * @param    {*}      value
	 * @return   {ObjectQuery}
	 * @desc     This allows you to update some records to some value.
	 */
	public update (column : String, value : any) : ObjectQuery
	{
		if (this.currentTable.cols .indexOf(column) > -1)
		{
			this.updateCol = column;
			this.updateValue = value;
		}

		else { console.log(`No such column '${column.toString()}' exists in the selected table.`); }
		return ObjectQuery.getInstance();
	}

	/**
	 * @public
	 * @function dump
	 * @return   {Object}
	 * @desc     This will return the databases property.
	 */
	public dump () : Object
	{
		// Cast any to keep TypeScript happy.
		return <any> this.databases;
	}


// END OF LOGIC RELATED CODE
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
// COMPUTATION RELATED CODE

  /**
   * @public
   * @function getCoolDown
   * @return   {Number}
   * @desc     The purpose of this method is to simply return the
   *           cool down property value.
   */
  public getCoolDown () : Number
  {
    return this.cooldown;
  }

  /**
   * @public
   * @function getLimit
   * @return   {Number}
   * @desc     The purpose of this method is to simply return the
   *           limit value.
   */
  public getLimit () : Number
  {

    if (this._limit == 0)
    {
      try { this._limit = this.currentTable.records.length; }
      catch (NullPointerException) { this.debug(NullPointerException); }
    }

    return this._limit;
  }

  /**
   * @public
   * @function getLimiter
   * @return   {Number}
   * @desc     The purpose of this method is to return the limiter,
   *           this is the property that's used to limit how many
   *           records you wish to analyse at any given time.
   */
  public getLimiter () : Number
  {
    return this._count;
  }

  /**
   * @public
   * @function getOffset
   * @return   {Number}
   * @desc     The purpose of this method is to return the offset value.
   */
  public getOffset () : Number
  {
    return this._offset;
  }

  /**
   * @public
   * @function setCoolDown
   * @param    {Number} cooldown
   * @return   {void}
   * @desc     The purpose of this method is to set the cool down property.
   */
  public setCoolDown (cooldown : Number) : ObjectQuery
  {
    this.cooldown = cooldown;
    return ObjectQuery.getInstance();
  }

  /**
   * @public
   * @function execute
   * @return   {void}
   * @desc     The purpose of this method is to do as the name may imply,
   *           this method swill essentially execute the query logic.
   *           This method is vital for the query execution to take place,
   *           this method encapsulates a tonne of logic. The reason as to why
   *           this method returns nothing is to simply ensure that when this
   *           code is being used, developers cannot chain more methods, i.e.
   *           It seems silly to run this execute method and then run some sort
   *           of delete clause.
   */
  public execute (callback? : Function) : void
  {
    let start = this._offset;
    const end = this._limit;
    let limiter : any = this._count;
    const cols = this.currentTable.cols;
    let logic = this._where.toString().toLowerCase();

    const symbols = [
      {txt:"not", symbol:"!"},
      {txt:"and", symbol:"&&"},
      {txt:"or", symbol:"||"},
      {txt:"gt", symbol:">"},
      {txt:"lt", symbol:"<"},
      {txt:"gte", symbol:">="},
      {txt:"lte", symbol:"<="}
    ];

    const methods = [
      {txt : 'indexof', value : 'indexOf'},
      {txt : 'tostring', value : 'toString'},
      {txt : 'tolowercase', value : 'toLowerCase'},
      {txt : 'touppercase', value : 'toUpperCase'}
    ];

    cols.forEach((col : String) => {
      const reg = new RegExp("\\b" + col.toString().toLowerCase() + "\\b", "g");
      const re = `record["${col.toString().toLowerCase()}"]`;
      logic = logic.replace(reg, re);
    });

    symbols.forEach((symbol : any) => {
      const txt = symbol.txt;
      const re = symbol.symbol;
      const reg = new RegExp("\\b" + txt.toString().toLowerCase() + "\\b", "g");
      logic = logic.replace(reg, re);
    });

    methods.forEach((method : any) => {
     const reg = new RegExp("\\b" + method.txt + "\\b", "g");
     const re = method.value;
     logic = logic.toString().replace(reg, re);
    });

    // invalid query constructed
    if (start == end || end == 0)
    {
      console.log('Invalid Query');
      return this.currentTable.records;
    }

    // if the limiter has not been manually set
    if (limiter == 0 || limiter > ObjectQuery.cap || isNaN(limiter))
    {
        limiter = ObjectQuery.cap;
    }

    // set the on complete property if a parameter has been provided
    if (callback != null && typeof callback == 'function')
    {
      this.onComplete(callback);
    }

    let timeout : any = null;

    // #=============================#
    // #  START OF PROCESSOR METHOD  #
    // #=============================#
    /**
     * @ignore
     * @private
     * @function processor
     * @desc     The purpose of this method is to simply encapsulate
     *           all of the complexity that may be involved with processing the
     *           logic provided to this query object.
     * @todo     Review performance and what not.
     */
    const processor = () => {
      let current = this.results.length;
      let finished = start >= (this.currentTable.records.length - 1) || current >= end;

      if (finished)
      {
        try
        {
          clearTimeout(timeout);

          // simple way to delete records
          if (this.toDelete === true || this.updateCol != null)
          {
              this.toDelete = false; // reset the value
            this.currentTable.records = this.results;
          }

          // this will order the results
          if (this._orderby != null && this._orderby != '')
          {
            if (this._order == 'asc') {
              const key = this._order.toString();
              this.results.sort((r1: any, r2: any) => {
                if (r1[key] > r2[key]) {
                  return 1;
                } else if (r1[key] < r2[key]) {
                  return -1;
                } else {
                  return 0;
                }
              });
            }

            else
            {
              const key = this._order.toString();
              this.results.sort((r1 : any, r2 : any) => {
                if (r1[key] > r2[key]) {
                  return -1;
                } else if (r1[key] < r2[key]) {
                  return 1;
                } else {
                  return 0;
                }
              });
            }
          }

          return this.oncomplete(this.results);
        }

        catch (Exception)
        {
          this.debug(Exception);
          console.log(Exception);
        }
      }

      for (let index : any = start, counter = 0; counter <= end; index ++, counter ++)
      {
        start = index; // update start value
        const record = this.currentTable.records[index];

        if (counter >= limiter || current >= end)
        {
          break;
        }

        // this means that we've exceeded the length of the array - possibly.
        // if not, then the data set is malformed anyway
        if (record == null)
        {
          finished = true;
          break;
        }

        // an simple alternative to using eval
        const code = 'var record = this;\n return ' + logic.toString();
        const truth = new Function(code).apply(record);

        // normal select query
        if (!this.toDelete)
        {
          if (truth)
          {
              // the update clause
             if (this.updateCol != null)
             {
               record[this.updateCol] = this.updateValue;
             }

            this.results.push(record);
          }
        }

        // a query with a delete clause
        else
        {
          if (!truth)
          {
            this.results.push(record);
          }
        }

        current = this.results.length;
      }

      if (typeof this.oncooldown == 'function')
      {
        this.oncooldown(this.results);
      }

      timeout = setTimeout(processor, this.cooldown);
    };
    // #===========================#
    // #  END OF PROCESSOR METHOD  #
    // #===========================#

    /**
     * @ignore
     * @desc   The purpose of this call is to run the method without
     *         having to initially apply the interval.
     */
    processor();
    return void 0;
  }

	/**
	 * @public
	 * @function forEach
	 * @param    {Function} query
	 * @desc     If for whatever reason the developer feels that a synchronous
	 *           approach may be better, then here it is.
	 */
	public forEach (query : Function) : void
	{
		const tbl : any = this.currentTable || {};
		const records : Array<any> = tbl.records || [];
		const size : any = records.length;

		for (let i = 0; i < size; i ++) { query(records[i]); }

		return void 0;
	}

	/**
	 * @public
	 * @function run
	 * @param    {Function} query
	 * @desc     This method allows the developer to implement their own form of
	 *           query based on the currently selected table's records.
	 */
	public run (query : Function) : void
	{
		const tbl : any = this.currentTable || {};
		const records : Array<any> = tbl.records || [];
		query(records);
		return void 0;
	}
// END OF COMPUTATION RELATED CODE
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

}


////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
// DEMO
const user_cols = ['id', 'first_name', 'last_name', 'job', 'age'];
const user_records = [
    {
        "id": 0,
        "age": 90,
        "first_name": "Finch",
        "last_name": "Sampson",
        "job": ""
    },
    {
        "id": 1,
        "age": 64,
        "first_name": "Pearson",
        "last_name": "Elliott",
        "job": ""
    },
    {
        "id": 2,
        "age": 80,
        "first_name": "Krystal",
        "last_name": "Harper",
        "job": ""
    },
    {
        "id": 3,
        "age": 36,
        "first_name": "Cooper",
        "last_name": "Powell",
        "job": ""
    },
    {
        "id": 4,
        "age": 66,
        "first_name": "Alexis",
        "last_name": "Gentry",
        "job": ""
    },
    {
        "id": 5,
        "age": 52,
        "first_name": "Leblanc",
        "last_name": "Perry",
        "job": ""
    },
    {
        "id": 6,
        "age": 47,
        "first_name": "Mcfarland",
        "last_name": "Giles",
        "job": ""
    },
    {
        "id": 7,
        "age": 78,
        "first_name": "Contreras",
        "last_name": "Francis",
        "job": ""
    },
    {
        "id": 8,
        "age": 95,
        "first_name": "Hamilton",
        "last_name": "Harrington",
        "job": ""
    },
    {
        "id": 9,
        "age": 60,
        "first_name": "Gladys",
        "last_name": "Mathews",
        "job": ""
    }
];

console.time('query');
console.time('progress');
const demo = ObjectQuery.getInstance();
demo.createDataBase('test_db');
demo.createTable('users');
let tbl = demo.getTable('users');
tbl.cols = user_cols;
tbl.records = user_records;


demo.selectFrom('users').where('age.toString().indexOf("6") GT -1').limit(100).offset(0).setCoolDown(10)
  .onCoolDown((/* r : any */) => {
    console.timeEnd('progress');
  })
  .execute((r : any) => {
    console.timeEnd('query');
    console.log('FINISHED!');
    console.log(r);
  });
