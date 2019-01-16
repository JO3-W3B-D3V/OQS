/**
 * @author    Joseph Evans <joeevs196@gmail.com>
 * @since     02/10/2018
 * @version   1.0.0
 * @file      The purpose of this file is to simply provide some form of
 *            insight into the capabilities and expectations of OQS.
 *            Within this file you will find tests that illustrate how
 *            you can use OQS within your own solution(s). These tests have
 *            been written using Mocha, this file has been written to illustrate
 *            how OQS works, and what it's limited to do. Some tests have been
 *            written to fail on purpose, to make it clear that OQS is not perfect,
 *            it can't do everything, but it was never engineered to be perfect and
 *            it was never engineered to do anymore than what it says on the tin.
 * @see       https://mochajs.org/
 * @copyright Joseph Evans (c) 2018
 */

import { describe } from 'mocha';
import { ObjectQuery, TableInterface, DataBaseInterface } from "../dev/OQS";
const assert = require('assert');
const OQS = ObjectQuery.getInstance();

/**
 * @ignore
 * @desc   This is the initial test that needs to be run, which then
 *         will make calls to other functions within the file to simply allow
 *         for more and more test(s) to take place.
 */
describe('Mocha Tests with OQS(Object Query Script)', function () {

  /**
   * @ignore
   * @desc   This test carries out a very simple test on checking the
   *         type of the OQS variable.
   */
  describe('Checking the type of OQS...', function () {
    it('Type is equal to ObjectQuery', function () {
      let test_result : Boolean = (<ObjectQuery>OQS != null);
      assert.equal(test_result, true);
    });
  });

  /**
   * @ignore
   * @desc   This block houses a range of tests regarding the
   *         database objects.
   * @todo   Include more tests.
   */
  describe('Checking database functionality...', function () {
    it('Checking the data type of a database object...', function () {
      OQS.createDataBase('test');
      let db = OQS.getDatabase('test');
      let test_result : Boolean = (<DataBaseInterface>db != null);
      assert.equal(test_result, true);
    });

    // pending ...
  });

  /**
   * @ignore
   * @desc   This block houses a range of tests regarding the
   *         logic applied to the tables within the database
   *         objects.
   * @todo   Include more tests.
   */
  describe('Checking table functionality...', function () {
    it('Checking the data type of the table object...', function () {
      OQS.createDataBase('test_tables');
      OQS.createTable('testTable');
      let tbl : any = OQS.getTable('testTable');
      let test_result : Boolean = (<TableInterface>tbl != null);
      assert.equal(test_result, true);
    });

    // pending ...
  });

  /**
   * @ignore
   * @desc   This block houses a range of tests regarding
   *         additional features.
   * @todo   Start writing tests.
   */
  describe('Testing additional functionality...', function () {
    it('Testing getter & setter for the limiter property...', function () {
      OQS.setLimiter(1);
      OQS.setLimiter(150);
      OQS.setLimiter(1);
      assert.equal(OQS.getLimit(), 150);
    });

    // pending ...
  });

  /**
   * @ignore
   * @desc   This block houses a range of tests regarding
   *         query logic.
   * @todo   Start writing tests.
   */
  describe('Testing query logic...', function () {
    // nothing so far ...
    let tbl : any = OQS.getTable('testTable');
    let db : any = OQS.getDatabase('test_tables');

    if (tbl == null || db == null)
    {
      OQS.createDataBase('test_tables');
      tbl = OQS.createTable('testTable');

      tbl.cols = ['id', 'first_name', 'last_name', 'job', 'age'];
      tbl.records = [{
        id : 0,
        first_name : 'Test',
        last_name : 'Demo',
        job : 'Software Tester',
        age : 100
      }];
    }

    it('Simple query test...', function (done : any) {
      OQS.select('*').from('testTable').where('age gte 100').execute((r : Array<Object>) => {
        assert.equal(r.length, 1);
        done();
      });
    });
  });
});
