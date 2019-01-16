#  🤖 OQS 🤖 
This is the latest implementation of Object Query Script, this one is written in TypeScript to 
make things somewhat neater. This implementation also makes use of asynchronous programming to 
further increase the performance of this solution. 

## Introduction 
OQS is a tool to simply implement an in-memory database into a JavaScript solution, you can use 
it either within the Node run time environment or within the web browser, the decision is up to 
you. Essentially you could look at why you should use OQS from a range of angles, such as: 

- A tool for partial disaster recover(server crash)
- Load balancing
- Offline/server-less tech 
- etc.

OQS uses asynchronous style programming to allow you to query a large data set without it 
blocking the I/O of the application. In theory, OQS has its **own** load balancing tool(s) in 
place to ensure that it's never consuming **too** much of your devices resources, whether the 
targeted device is mobile or desktop(s), etc. The only time OQS may begin to struggle is when you
 try to pass it so many items that the JavaScript environment's heap has run out of memory, or 
 something equally as ridiculous along those lines. 

## Background 
OQS(Object Query Script) was written by [me](https://github.com/JO3-W3B-D3V) while I was working 
in an unusual role. I was a front end developer, the back end was totally outsourced and the back end 
development team would **not** play ball with regards to developing new features, which is why I 
had to get creative. 

I implemented all sorts from _unusual_ caching implementations through to relying on interesting 
loading screens, etc. The back end that I was working with was slow, it was just awful, it's a 
part of the reason as to why I moved on to another role. 

Being a software developer, I take pride in my work, _maybe_ sometimes too much. But among all of
the hacks that I had created whilst working in this **unusual** front end development role, I 
created one thing that to this day I think is pretty good, queue OQS. 

As there was no way for us to query a database, I thought about creating a virtual database on 
the front end, using JSON/JavaScript literal objects. The initial implementation worked, **but** 
it was messy, it lacked documentation, it lacked test(s)/testing, not to mention how the initial 
implementation relied on synchronous style coding, not to mention how I gave it a slightly 
different name of JS-SQL. It wasn't too bad, all things considered it was still quite fast and it
 supported legacy browsers too... But like I said, I take pride in my work and I wanted to do 
 better...

## Why OQS?
Simple, OQS is a simple in-memory database, it's a very simplistic implementation, it's well 
documented, it's pretty fast (but I'm going to make it faster), and it even has its own test(s) 
that have been written using Mocha. I'm even going as far as trying to implement a WebAssembly solution, 
this should allow for the best possible speed results. 

What more could you want from an in-memory database? 😃

But seriously, being open and honest, OQS is superior for handling huge data sets 
compared to its alternatives, and being totally honest, technologies such as LokiJS are by 
far better for querying smaller data sets. LokiJS is faster for smaller data sets as it’s 
all synchronous, with OQS it’s asynchronous, this is deliberate, through it being asynchronous,
this means that it’ll never require too much of the devices resources. This further implies 
that through it being asynchronous, you can use the rest of the resources for your 
own application, if you need to run something computationally complex while executing a 
query, OQS is possibly the best choice.  

## Docs & Whatnot
With regards to documentations, you can use [JSDoc](http://usejsdoc.org/). With regards to 
testing, you can use [Mocha](https://mochajs.org/), there are already a number of basic tests 
included and what not, these are here for a range of reasons, such as: 

- Scope (Shows what it can/can't do)
- Testing (Obviously...)
- Performance Benchmarks
- Proof of Reliability 
- etc.

## Todo
1. I need to implement some form of distinct clause. 
2. Performance!!!!! 
3. Security??? - Maybe? ... Is there any point? ...
4. Multi-threading? ... Over complicating things? ...

## 
> Made with ❤ by [me](https://github.com/JO3-W3B-D3V), in GB.
