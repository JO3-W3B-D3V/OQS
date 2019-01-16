/**
 * @author    Joseph Evans <joeevs196@gmail.com>
 * @since     02/10/2018
 * @version   1.0.0
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
 * @copyright Joseph Evans (c) 2018
 */
/**
 * @global
 * @class ObjectQuery
 * @desc  The purpose of this class is to simply execute SQL like logic
 *        on some data set.
 */
var ObjectQuery = /** @class */ (function () {
    /**
     * @private
     * @function constructor
     * @desc     The constructor has been set to private
     *           just to force other scripts to use the
     *           'getInstance' method.
     */
    function ObjectQuery() {
        /**
         * @private
         * @property _order
         * @type     String
         * @desc     The purpose of this property is to simply state
         *           which order you would like to order the results by.
         *           The default order will be ascending order.
         */
        this._order = 'asc';
        /**
         * @private
         * @property toDelete
         * @type     Boolean
         * @desc     This property is used as a flag to state whether or not the
         *           record should be removed from the relevant table.
         */
        this.toDelete = false;
        /**
         * @private
         * @property updateCol
         * @type     *
         * @desc     This is the method that you would like to run when you wish
         *           to update a set of records. I've set this to null to simply
         *           allow for the process method to see if this property is set to
         *           null or not, rather than over complicate things.
         */
        this.updateCol = null;
        /**
         * @private
         * @property updateValue
         * @type     *
         * @desc     This is the value that you'd like to assign to the update column.
         */
        this.updateValue = '';
        var msg = '\n\n🤖 Welcome To OQS 🤖\n';
        msg += '\n\n... AKA Object Query Script';
        msg += "\nWelcome to object query script, you're a smart developer!";
        msg += "\nYou've decided that you'd like to excute some queries on the client side.";
        msg += "\nThis means that if your back end solution goes down! Hey no worries!";
        msg += "\nThanks to OQS you can query some cached data on the clients device!";
        msg += "\nI hope you enjoy and feel free to drop me an email at joeevs196@gmail.com! ✉️";
        msg += "\n\n\n";
        try {
            console.info(msg);
        }
        catch (Exception) {
            this.debug(Exception);
            console.log(msg);
        }
        ObjectQuery.cap = 10000;
        ObjectQuery.minimalCap = 100;
        this.cooldown = 100;
        this._orderby = '';
        this._select = '';
        this._where = '';
        this._from = '';
        this._offset = 0;
        this._index = 0;
        this._count = 0;
        this._limit = 0;
        this.currentTable = null;
        this.current = {};
        this.databases = {};
        this.queue = [];
        this.oncomplete = function () { };
        this.onprogress = function () { };
        this.oncooldown = function () { };
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
    ObjectQuery.getInstance = function () {
        if (ObjectQuery.instance == null) {
            ObjectQuery.instance = new ObjectQuery();
        }
        return ObjectQuery.instance;
    };
    /**
     * @public
     * @function toggleDebug
     * @return   {ObjectQuery}
     * @desc     The purpose of this method is to simply
     *           activate the ability to see any errors
     *           produced by this class.
     */
    ObjectQuery.prototype.toggleDebug = function () {
        this.debug_active = !this.debug_active;
        return ObjectQuery.getInstance();
    };
    /**
     * @private
     * @function debug
     * @param    {*} Error
     * @return   {ObjectQuery}
     * @desc     The purpose of this method is to simply
     *           log any errors that this class has produced.
     */
    ObjectQuery.prototype.debug = function (Error) {
        if (this.debug) {
            console.log('=============');
            console.log('=== ERROR ===');
            console.log(Error);
            console.log('=== ERROR ===');
            console.log('=============');
        }
        return ObjectQuery.getInstance();
    };
    /**
     * @private
     * @function isValidString
     * @param    {String} string
     * @return   {Boolean}
     * @desc     The purpose of this method is to simply
     *           verify that a provided string is relevant.
     */
    ObjectQuery.prototype.isValidString = function (string) {
        try {
            return string.replace(/\ /g, '').length > 0;
        }
        catch (Error) {
            this.debug(Error);
            return false;
        }
    };
    /**
     * @public
     * @function isValidInt
     * @param    {Number} number
     * @return   {Boolean}
     * @desc     The purpose of this method is to simply return
     *           whether or not a given number is a valid integer
     *           and it's not lower than the capped number and isn't
     *           lower than 0.
     */
    ObjectQuery.prototype.isValidInt = function (number) {
        try {
            // just make sure that the number is of type int
            number = parseInt(number.toString());
            return number <= ObjectQuery.cap && number > 0;
        }
        catch (Error) {
            this.debug(Error);
            return false;
        }
    };
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
    ObjectQuery.prototype.getDataBases = function () {
        return this.databases;
    };
    /**
     * @public
     * @function getDatabase
     * @param    {String} name
     * @return   {DataBaseInterface}
     * @desc     The purpose of this method is to simply
     */
    ObjectQuery.prototype.getDatabase = function (name) {
        if (name == null) {
            // @ts-ignore
            return this.current;
        }
        if (this.isValidString(name)) {
            // @ts-ignore
            var db = this.databases[name];
            return db;
        }
        // @ts-ignore
        return null;
    };
    /**
     * @public
     * @function createDataBase
     * @param    {String} name
     * @return   {ObjectQuery}
     * @desc     The purpose of this method is to simply allow
     *           you to create a database object which essentially
     *           implements the 'DataBaseInterface' interface.
     */
    ObjectQuery.prototype.createDataBase = function (name) {
        if (this.getDatabase(name) == null) {
            var tables = {};
            var db = {
                name: name,
                tables: tables
            };
            // @ts-ignore
            this.databases[name] = db;
            // @ts-ignore
            this.current = this.databases[name];
        }
        return ObjectQuery.getInstance();
    };
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
     */
    ObjectQuery.prototype.selectDataBase = function (name) {
        if (this.getDatabase(name) != null && name != null) {
            this.current = this.getDatabase(name);
        }
        return ObjectQuery.getInstance();
    };
    /**
     * @public
     * @function cloneDataBase
     * @param    {String} name
     * @param    {String} newName
     * @return   ObjectQuery
     * @desc     The purpose of this method is to simply clone one
     *           database and all of it's contents into a new database.
     */
    ObjectQuery.prototype.cloneDataBase = function (name, newName) {
        try {
            if (this.getDatabase(name) != null && this.getDatabase(newName) == null && this.isValidString(newName)) {
                var db = JSON.parse(JSON.stringify(this.getDatabase(name)));
                // @ts-ignore
                this.databases[newName] = db;
            }
        }
        catch (Error) {
            this.debug(Error);
        }
        return ObjectQuery.getInstance();
    };
    /**
     * @public
     * @function dropDataBase
     * @param    {String} name
     * @return   {ObjectQuery}
     * @desc     The purpose of this method is to remove one of the
     *           database objects from memory, essentially deleting the
     *           database.
     */
    ObjectQuery.prototype.dropDataBase = function (name) {
        try {
            // @ts-ignore
            if (this.current.name == name) {
                this.current = {};
            }
            // @ts-ignore
            delete this.databases[name];
        }
        catch (Error) {
            this.debug(Error);
        }
        return ObjectQuery.getInstance();
    };
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
    ObjectQuery.prototype.getTables = function () {
        try {
            // @ts-ignore
            return this.current.tables;
        }
        catch (Error) {
            this.debug(Error);
        }
        // @ts-ignore
        return null;
    };
    /**
     * @public
     * @function getTable
     * @param    {String} name
     * @return   {TableInterface}
     * @desc     The purpose of this method is to simply return a specific table.
     */
    ObjectQuery.prototype.getTable = function (name) {
        try {
            if (this.isValidString(name)) {
                // @ts-ignore
                if (this.current[name] != null) {
                    // @ts-ignore
                    return this.current[name];
                }
            }
            // @ts-ignore
            return null;
        }
        catch (Error) {
            this.debug(Error);
        }
        // @ts-ignore
        return null;
    };
    /**
     * @public
     * @function createTable
     * @param    {String} name
     * @return   {ObjectQuery}
     * @desc     The purpose of this method is to simply create a table in
     *           the currently selected database.
     */
    ObjectQuery.prototype.createTable = function (name) {
        if (this.isValidString(name) && this.getTable(name) == null) {
            var rows = 0;
            var cols = [];
            var records = [];
            var table = {
                name: name,
                size: rows,
                cols: cols,
                records: records
            };
            // @ts-ignore
            this.current[name] = table;
            this.currentTable = table;
        }
        return ObjectQuery.getInstance();
    };
    /**
     * @public
     * @function cloneTable
     * @param    {String} name
     * @param    {String} newName
     * @return   {ObjectQuery}
     * @desc     The purpose of this method is to simply clone a table
     *           into a new table within the currently selected database.
     */
    ObjectQuery.prototype.cloneTable = function (name, newName) {
        try {
            if (this.getTable(name) != null && this.getTable(newName) == null && this.isValidString(newName)) {
                var clonedTable = JSON.parse(JSON.stringify(this.getTable(name)));
                // @ts-ignore
                this.current[newName] = clonedTable;
                this.currentTable = clonedTable;
            }
        }
        catch (Error) {
            this.debug(Error);
        }
        return ObjectQuery.getInstance();
    };
    /**
     * @public
     * @function dropTable
     * @param    {String} name
     * @return   {ObjectQuery}
     * @desc     The purpose of this method is to simply delete a specific table
     *           from the currently selected database.
     */
    ObjectQuery.prototype.dropTable = function (name) {
        try {
            if (this.getTable(name) != null) {
                // @ts-ignore
                var table = this.current[name];
                if (table.name == this.currentTable.name) {
                    this.currentTable = null;
                }
                // @ts-ignore
                delete this.current[name];
            }
        }
        catch (Error) {
            this.debug(Error);
        }
        return ObjectQuery.getInstance();
    };
    /**
     * @public
     * @function getTableSize
     * @return   {Number}
     * @desc     The purpose of this method is to simply return the size
     *           of the currently selected table.
     */
    ObjectQuery.prototype.getTableSize = function () {
        try {
            if (this.currentTable != null) {
                return this.currentTable.size;
            }
            return 0;
        }
        catch (Error) {
            this.debug(Error);
            return 0;
        }
    };
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
    ObjectQuery.prototype.insertSafely = function (table, data) {
        var cols = table.cols;
        for (var i = 0, size = data.length; i < size; i++) {
            var record = data[i];
            var obj = {};
            var valid = false;
            for (var j = 0, _size = cols.length; j < _size; j++) {
                var col = cols[j].toString().toLowerCase();
                if (!(col.toString() in record)) {
                    valid = false;
                    break;
                }
                // @ts-ignore
                obj[col] = record[col];
                valid = true;
            }
            if (valid) {
                table.records.push(obj);
            }
        }
        return void 0;
    };
    /**
     * @public
     * @function insertInto
     * @param    {String} name
     * @param    {Array<Object>} data
     * @desc     The purpose of this method is to simply take some data and
     *           insert it into a specific table.
     */
    ObjectQuery.prototype.insertInto = function (name, data) {
        var table = this.getTable(name);
        if (table != null) {
            this.insertSafely(table, data);
        }
        return ObjectQuery.getInstance();
    };
    /**
     * @public
     * @function insert
     * @param    {Array<Object>} data
     * @desc     The purpose of this method is to simply take some data and
     *           insert it into the currently selected table.
     */
    ObjectQuery.prototype.insert = function (data) {
        var table = this.currentTable;
        if (table != null) {
            this.insertSafely(table, data);
        }
        return ObjectQuery.getInstance();
    };
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
    ObjectQuery.prototype.onProgress = function (callback) {
        this.onprogress = callback;
        return ObjectQuery.getInstance();
    };
    /**
     * @public
     * @function onComplete
     * @param    {Function} callback
     * @return   {ObjectQuery}
     * @desc     The purpose of this method is to simply execute some
     *           callback method once the query has finished.
     */
    ObjectQuery.prototype.onComplete = function (callback) {
        this.oncomplete = callback;
        return ObjectQuery.getInstance();
    };
    /**
     * @public
     * @function onCoolDown
     * @param    {Function} callback
     * @return   {ObjectQuery}
     * @desc     The purpose of this method is to set the on cool
     *           down property.
     */
    ObjectQuery.prototype.onCoolDown = function (callback) {
        this.oncooldown = callback;
        return ObjectQuery.getInstance();
    };
    /**
     * @public
     * @function select
     * @param    {String} select
     * @return   {ObjectQuery}
     * @desc     The purpose of this method is to simply allow a user
     *           to specify the select statement.
     * @todo     Include some validation of some sort.
     */
    ObjectQuery.prototype.select = function (select) {
        this._select = select;
        return ObjectQuery.getInstance();
    };
    /**
     * @public
     * @function from
     * @param    {String} name
     * @return   {ObjectQuery}
     * @desc     The purpose of this method is to essentially state where
     *           you'd like to query the data from, etc.
     */
    ObjectQuery.prototype.from = function (name) {
        var table = this.getTable(name);
        if (table != null) {
            this.currentTable = table;
        }
        return ObjectQuery.getInstance();
    };
    /**
     * @public
     * @function where
     * @param    {String} where
     * @return   {ObjectQuery}
     * @desc     The purpose of this method is to simply set the
     *           where clause.
     */
    ObjectQuery.prototype.where = function (where) {
        if (this.isValidString(where)) {
            this._where = where;
        }
        return ObjectQuery.getInstance();
    };
    /**
     * @public
     * @function limit
     * @param    {Number} number
     * @return   {ObjectQuery}
     * @desc     The purpose of this method is to simply set the limit
     *           in terms of the max number of results you'd like to see
     *           in the results.
     */
    ObjectQuery.prototype.limit = function (number) {
        //if (this.isValidInt(number))
        //{
        this._limit = number;
        //}
        return ObjectQuery.getInstance();
    };
    /**
     * @public
     * @function
     * @return   {ObjectQuery}
     * @desc
     */
    ObjectQuery.prototype.setLimiter = function (limiter) {
        if (limiter <= ObjectQuery.cap && limiter >= ObjectQuery.minimalCap) {
            // todo
            this._count = limiter;
        }
    };
    /**
     * @public
     * @function offset
     * @param    {Number} number
     * @return   {ObjectQuery}
     * @desc     The purpose of this method is to simply set the offset
     *           with the query, aka where you'd like to start the initial
     *           index from, default is set to 0.
     */
    ObjectQuery.prototype.offset = function (number) {
        if (this.isValidInt(number) && number < this.getTableSize()) {
            this._offset = number;
        }
        return ObjectQuery.getInstance();
    };
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
    ObjectQuery.prototype.orderBy = function (orderby, order) {
        if (this.currentTable.cols.indexOf(orderby) > -1) {
            this._orderby = orderby;
            if (order == null) {
                order = '';
            }
            var ord = order.toString().toLowerCase().replace(new RegExp(' ', 'g'), '');
            if (ord == 'asc' || ord == 'desc') {
                this._order = ord;
            }
            else {
                this._order = 'asc';
            }
        }
        return ObjectQuery.getInstance();
    };
    /**
     * @todo
     * @public
     * @function delete
     * @return   {ObjectQuery}
     * @desc     The purpose of this method is to simply
     *           state that you would like to remove the
     *           relevant records from the current table.
     */
    ObjectQuery.prototype.delete = function () {
        this.toDelete = true;
        return ObjectQuery.getInstance();
    };
    /**
     * @todo
     * @public
     * @function update
     * @param    {String} column
     * @param    {*}      value
     * @return   {ObjectQuery}
     * @desc     This allows you to update some records to some value.
     */
    ObjectQuery.prototype.update = function (column, value) {
        if (this.currentTable.cols.indexOf(column) > -1) {
            this.updateCol = column;
            this.updateValue = value;
        }
        else {
            consol.log("No such column '" + column.toString() + "' exists in the selected table.");
        }
        return ObjectQuery.getInstance();
    };
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
    ObjectQuery.prototype.getCoolDown = function () {
        return this.cooldown;
    };
    /**
     * @public
     * @function getLimit
     * @return   {Number}
     * @desc     The purpose of this method is to simply return the
     *           limit value.
     */
    ObjectQuery.prototype.getLimit = function () {
        if (this._limit == 0) {
            try {
                this._limit = this.currentTable.records.length;
            }
            catch (NullPointerException) {
                this.debug(NullPointerException);
            }
        }
        return this._limit;
    };
    /**
     * @public
     * @function getLimiter
     * @return   {Number}
     * @desc     The purpose of this method is to return the limiter,
     *           this is the property that's used to limit how many
     *           records you wish to analyse at any given time.
     */
    ObjectQuery.prototype.getLimiter = function () {
        return this._count;
    };
    /**
     * @public
     * @function getOffset
     * @return   {Number}
     * @desc     The purpose of this method is to return the offset value.
     */
    ObjectQuery.prototype.getOffset = function () {
        return this._offset;
    };
    /**
     * @public
     * @function setCoolDown
     * @param    {Number} cooldown
     * @return   {void}
     * @desc     The purpose of this method is to set the cool down property.
     */
    ObjectQuery.prototype.setCoolDown = function (cooldown) {
        this.cooldown = cooldown;
        return ObjectQuery.getInstance();
    };
    /**
     * @public
     * @function execute
     * @return   {void}
     * @desc     The purpose of this method is to do as the name may imply,
     *           this method swill essentially execute the query logic.
     */
    ObjectQuery.prototype.execute = function (callback) {
        var _this = this;
        var start = this._offset;
        var end = this._limit;
        var limiter = this._count;
        var cols = this.currentTable.cols;
        var logic = this._where.toString().toLowerCase();
        var symbols = [
            { txt: "not", symbol: "!" },
            { txt: "and", symbol: "&&" },
            { txt: "or", symbol: "||" },
            { txt: "gt", symbol: ">" },
            { txt: "lt", symbol: "<" },
            { txt: "gte", symbol: ">=" },
            { txt: "lte", symbol: "<=" }
        ];
        var methods = [
            { txt: 'indexof', value: 'indexOf' },
            { txt: 'tostring', value: 'toString' },
            { txt: 'tolowercase', value: 'toLowerCase' },
            { txt: 'touppercase', value: 'toUpperCase' }
        ];
        cols.forEach(function (col) {
            var reg = new RegExp("\\b" + col.toString().toLowerCase() + "\\b", "g");
            var re = "record[\"" + col.toString().toLowerCase() + "\"]";
            logic = logic.replace(reg, re);
        });
        symbols.forEach(function (symbol) {
            var txt = symbol.txt;
            var re = symbol.symbol;
            var reg = new RegExp("\\b" + txt.toString().toLowerCase() + "\\b", "g");
            logic = logic.replace(reg, re);
        });
        methods.forEach(function (method) {
            var reg = new RegExp("\\b" + method.txt + "\\b", "g");
            var re = method.value;
            logic = logic.toString().replace(reg, re);
        });
        // invalid query constructed
        if (start == end || end == 0) {
            console.log('Invalid Query');
            return this.currentTable.records;
        }
        // if the limiter has not been manually set
        if (limiter == 0 || limiter > ObjectQuery.cap || isNaN(limiter)) {
            limiter = ObjectQuery.cap;
        }
        // set the on complete property if a parameter has been provided
        if (callback != null && typeof callback == 'function') {
            this.onComplete(callback);
        }
        // @ts-ignore
        var interval = null;
        /**
         * @ignore
         * @private
         * @function processor
         * @desc     The purpose of this method is to simply encapsulate
         *           all of the complexity that may be involved with processing the
         *           logic provided to this query object.
         * @todo     Review performance and what not.
         */
        var processor = function () {
            var current = _this.results.length;
            var finished = start >= (_this.currentTable.records.length - 1) || current >= end;
            if (finished) {
                try { // @ts-ignore
                    clearInterval(interval);
                    // simple way to delete records
                    if (_this.toDelete === true || _this.updateCol != null) {
                        _this.toDelete = false; // reset the value
                        _this.currentTable.records = _this.results;
                    }
                    // this will order the results
                    if (_this._orderby != null && _this._orderby != '') {
                        if (_this._order == 'asc') {
                            _this.results.sort(function (r1, r2) {
                                if (r1[_this._orderby] > r2[_this._orderby]) {
                                    return 1;
                                }
                                else if (r1[_this._orderby] < r2[_this._orderby]) {
                                    return -1;
                                }
                                else {
                                    return 0;
                                }
                            });
                        }
                        else {
                            _this.results.sort(function (r1, r2) {
                                if (r1[_this._orderby] > r2[_this._orderby]) {
                                    return -1;
                                }
                                else if (r1[_this._orderby] < r2[_this._orderby]) {
                                    return 1;
                                }
                                else {
                                    return 0;
                                }
                            });
                        }
                    }
                    return _this.oncomplete(_this.results);
                }
                catch (Exception) {
                    _this.debug(Exception);
                    console.log(Exception);
                }
            }
            for (var index = start, counter = 0; counter <= end; index++, counter++) {
                start = index; // update start value
                var record = _this.currentTable.records[index];
                if (counter >= limiter || current >= end) {
                    break;
                }
                // this means that we've exceeded the length of the array - possibly.
                // if not, then the data set is malformed anyway
                if (record == null) {
                    finished = true;
                    break;
                }
                // normal select query
                if (!_this.toDelete) {
                    if (eval(logic.toString())) {
                        // the update clause
                        if (_this.updateCol != null) {
                            record[_this.updateCol] = _this.updateValue;
                        }
                        _this.results.push(record);
                    }
                }
                // a query with a delete clause
                else {
                    if (!eval(logic.toString())) {
                        _this.results.push(record);
                    }
                }
                current = _this.results.length;
            }
            if (typeof _this.oncooldown == 'function') {
                _this.oncooldown(_this.results);
            }
        };
        /**
         * @ignore
         * @desc   The purpose of this call is to run the method without
         *         having to initially apply the interval.
         */
        processor();
        /**
         * @ignore
         * @private
         * @function interval
         * @desc     This is essentially the loop the will be run to iterate
         *           through the array of data. The below numeric variables
         *           (counter & index) are set to type 'any' just to prevent
         *           having to use '@ts-ignore'.
         */
        if (this.results.length < this._limit) {
            interval = setInterval(function () {
                processor();
            }, this.cooldown);
        }
        return void 0;
    };
    return ObjectQuery;
}());
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
// DEMO
var user_cols = ['id', 'first_name', 'last_name', 'job', 'age'];
var user_records = [
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
// const json  = require('./data.json');
// const user_records = json.data;
console.time('query');
console.time('progress');
var demo = ObjectQuery.getInstance();
demo.createDataBase('test_db');
demo.createTable('users');
var tbl = demo.getTable('users');
tbl.cols = user_cols;
tbl.records = user_records;
demo.select('*')
    .from('users')
    .where('first_name.indexOf("6") GT -1')
    .limit(100)
    .offset(0)
    .setCoolDown(0)
    .setCoolDown(10)
    .onCoolDown(function (r) {
        console.timeEnd('progress');
    })
    .execute(function (r) {
        console.timeEnd('query');
        console.log('FINISHED!');
        console.log(r);
    });
