export default function querydb(sql, connection) {
  return new Promise((resolve) => {
    connection.query(sql, (error, result) => {
      if (error) throw new Error(error);
      resolve(result);
    });
  });
}
