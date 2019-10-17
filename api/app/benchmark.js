/* Run MySQL & Mongo queries */
async function run(mongoClient, mysqlClient) {
  return Promise.all([mongoClient, mysqlClient])
    .then(res => {
      console.log("Mongodb Connected!");
      console.log("Mysql Connected!");
      const results = [];
      results.push(...mongoQueriesHandler(res[0].db('test')));
      results.push(...mysqlQueriesHandler(res[1]));
      return resultsHandler(results);
    })
    .catch(err => console.error(err));
}

/* Return MySQL queries as promises */
function mysqlQueriesHandler(connection) {
  console.log('-- EXECUTING MYSQL QUERIES --');

  // Joins authors with their posts
  const query = 'SELECT authors.*, posts.* FROM authors JOIN posts ON authors.id = posts.author_id';

  // Joins authors with their posts and excludes those who have less than 100 posts
  const query2 = 'with PostCounter(cont,id) as(SELECT Count(p.author_id), p.author_id FROM posts p Group by p.author_id) '
  + 'SELECT a.*, p.* FROM authors a , posts p, PostCounter pc where a.id = p.author_id and pc.cont>=100 and a.id = pc.id';

  // Joins authors with their posts and excludes those who have less than 40 posts 
  // and more than 80 posts
  const query3 = 'with PostCounter(cont,id) as(SELECT Count(p.author_id), p.author_id FROM posts p Group by p.author_id) '
  + 'SELECT a.*, p.* FROM authors a , posts p, PostCounter pc where a.id = p.author_id and pc.cont>=40 and pc.cont<=80 and a.id=pc.id'
    
   // Joins authors with their posts and excludes those who have less than 50 posts 
  // and all of them was published before 2000/01/01
  const query4 = 'with PostCounter(cont,id) as(SELECT Count(p.author_id), p.author_id FROM posts p Group by p.author_id)'
  + 'SELECT a.*, p.* FROM authors a , posts p, PostCounter pc where a.id = p.author_id and pc.cont>=50 and a.id=pc.id and '
  + 'p.date >= "2000-01-01"';

  // Joins authors with their posts and excludes those who: 
  // - were born before 1999/01/01
  // - their email don't match the regex
  // - have less than 30 posts and all of them was published before 1995/03/15
  const query5 = 'with PostCounter(cont,id) as(SELECT Count(p.author_id), p.author_id FROM posts p Group by p.author_id) '
  + 'SELECT a.*, p.* FROM authors a , posts p, PostCounter pc where a.id = p.author_id and pc.cont>=30 and a.id=pc.id and '
  + 'p.date >= "1995-03-15" and a.birthdate >= "1999-01-01" and a.email REGEXP "^.*([0-9]+).*\.com$"';
  
  return [
    mysqlQueryToPromise(connection, query),
    mysqlQueryToPromise(connection, query2),
    mysqlQueryToPromise(connection, query3),
    mysqlQueryToPromise(connection, query4),
    mysqlQueryToPromise(connection, query5),
  ];
}

/* Return Mongo queries as promises */
function mongoQueriesHandler(db) {
  console.log('-- EXECUTING MONGO QUERIES --');
  
  // Joins authors with their posts
  const query = [
    {
      $lookup: {
        from: 'posts',
        localField: '_id',
        foreignField: 'author_id',
        as: 'posts'
      }
    }
  ];

  // Joins authors with their posts and excludes those who have less than 100 posts
  const query2 = [
    {
      $lookup: {
        from: 'posts',
        localField: '_id',
        foreignField: 'author_id',
        as: 'posts'
      }
    },
    {
      $match: {
        $expr: {
          $gte: [ {$size: '$posts'}, 100]
        }
      }
    }
  ];

  // Joins authors with their posts and excludes those who have less than 40 posts 
  // and more than 80 posts
  const query3 = [
    {
      $lookup: {
        from: 'posts',
        localField: '_id',
        foreignField: 'author_id',
        as: 'posts'
      }
    },
    {
      $match: {
        $expr: {
          $and: [
            {
              $gte: [ {$size: '$posts'}, 40]
            },
            {
              $lte: [ {$size: '$posts'}, 80]
            }
          ] 
        }
      }
    }
  ];

  // Joins authors with their posts and excludes those who have less than 50 posts 
  // and all of them was published before 2000/01/01
  const query4 = [
    {
      $lookup: {
        from: 'posts',
        let: {
          id: '$_id'
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $gte: [ '$date', new Date(2000, 0, 1)]
                  },
                  {
                    $eq: [ '$$id','$author_id' ]
                  }
                ]
              }
            }
          }
        ],
        as: 'posts'
      }
    },
    {
      $match: {
        $expr: {
          $gte: [ {$size: '$posts'}, 50]
        }
      }
    }
  ];

  // Joins authors with their posts and excludes those who: 
  // - were born before 1999/01/01
  // - their email don't match the regex
  // - have less than 30 posts and all of them was published before 1995/03/15
  const query5 = [
    {
      $match: {
        $expr: {
          $gte: [ '$birthdate', new Date(1999, 0, 1)]
        },
        email: /^.*(\d+).*\.com$/ig
      }
    },
    {
      $lookup: {
        from: 'posts',
        let: {
          id: '$_id'
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $gte: [ '$date', new Date(1995, 3, 15)]
                  },
                  {
                    $eq: [ '$$id','$author_id' ]
                  }
                ]
              }
            }
          }
        ],
        as: 'posts'
      }
    },
    {
      $match: {
        $expr: {
          $gt: [ {$size: '$posts'}, 30],
        }
      }
    }
  ];
  

  return [
    mongoQueryHandler(db, query),
    mongoQueryHandler(db, query2),
    mongoQueryHandler(db, query3),
    mongoQueryHandler(db, query4),
    mongoQueryHandler(db, query5),
  ];
}

/* Converts a MySQL query to a promise */
function mysqlQueryToPromise(connection, query) {
  const preTime = new Date().getTime()
  return new Promise((resolve, reject) => {
    connection.query(query,(err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(((new Date().getTime() - preTime) / 1000) + ' seconds');
      }     
    })
  })
}

/* Use aggregation in order to get the query time */
function mongoQueryHandler(db, operations) {
  const preTime = new Date().getTime();
  return db.collection('authors').aggregate(operations).toArray()
    .then(() => ((new Date().getTime() - preTime) / 1000) + ' seconds');
}

/* Execute queries by resolving their promises */
async function resultsHandler(results) {
  return Promise.all(results)
    .then(res => displayResults(res.slice(0, 5,), res.slice(5, 10)))
    .catch(err => console.error(err));
}
/* Show results */
function displayResults(mongoTimes, sqlTimes) {
  console.log('\n', '-- DATA DETAILS --');
  console.log('* 500 AUTHORS ' );
  console.log('* 73200 POSTS ' );
  console.log('\n', '-- RESULTS --');
  const parsedArr = [];
  for (let i = 0, n = 5; i < n; i++) {
    parsedArr.push({
      mongo: mongoTimes[i],
      MySQL: sqlTimes[i],
    })
  }
  console.table(parsedArr);
  return parsedArr;
}

module.exports = {
  run
};
