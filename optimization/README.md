Performance advices

* Limit the requests per second

As soon as posible check the number of requests per second and limit it to a reasonable number. If you have a lot of requests per second, you can use a cache system like Varnish or Redis.

* Use the performance node util
  Example:
    
      ```
        _performanece.mark('start');
      // do something
        _performanece.mark('continue');
      // do something
        _performanece.mark('end');
      //Gather the results
        _performanece.measure('First steps','start', 'continue');
        _performanece.measure('Whole process','start', 'end');
      //Log out all the measurements
        const measurements = _performance.getEntriesByType('measure')
            measurements.forEach((measurement) => {
                debug('\x1b[33m%s\x1b[0m', measurement.name + ' ' + measurement.duration)
        });
      ```

* Debugging
  
  Debugger commands are:
    cont - continue
    next - next line
    step - step into function
    out - step out of function
    

  ```
    debugger
    //some code
    debugger
  ```