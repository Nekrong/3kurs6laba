const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const pool = new Pool({
  user: "me",
  host: "localhost",
  database: "students",
  password: "password",
  port: 5432
});

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.status(201).send("Created");
});

app.get("/students", (req, res, next) => {
  pool.connect(function (err, client, done) {
    if (err) return next(err);

    client.query("SELECT * FROM students;", [], function (err, result) {
      done();
      if (err) return next(err);

      if (result.rows.length === 0)
        res.status(404).send("Error: the source array is empty");
      else res.send(result.rows);
    });
  });
});

app.get("/students/:id", (req, res, next) => {
  pool.connect(function (err, client, done) {
    if (err) return next(err);

    client.query("SELECT * FROM students;", [], function (err, result) {
      done();
      if (err) return next(err);

      let students = result.rows;
      if (students.length === 0)
        res.status(404).send("Error: the source array is empty");
      else if (req.params.id >= students.length)
        res.status(404).send("Error: the object is not found!");
      else if (req.params.id < 0) res.status(400).send("Error: invalid index");
      else {
        let student = students.find((student) => {
          return student.id === Number(req.params.id);
        });
        res.status(200).send(student);
      }
    });
  });
});

app.post("/students", (req, res, next) => {
  pool.connect(function (err, client, done) {
    if (err) return next(err);

    client.query(
      "INSERT INTO students (first_name, last_name, group_name, created_at,updated_at) VALUES ($1, $2, $3, $4, $5);",
      [
        req.body.firstName,
        req.body.lastName,
        req.body.group,
        new Date(),
        new Date()
      ],
      function (err, result) {
        done();
        if (err) return next(err);
        else res.status(200).send("Added");
      }
    );
  });
});

app.put("/students/:id", (req, res, next) => {
  pool.connect(function (err, client, done) {
    if (err) return next(err);

    client.query(
      "UPDATE students SET first_name = ($1), last_name = ($2), group_name = ($3), updated_at = ($4) WHERE ID = ($5) ;",
      [
        req.body.firstName,
        req.body.lastName,
        req.body.group,
        new Date(),
        req.params.id
      ],
      function (err, result) {
        done();
        if (err) return next(err);
        else res.status(201).send("Updated!");
      }
    );
  });
});

app.delete("/students/:id", (req, res, next) => {
  pool.connect(function (err, client, done) {
    if (err) return next(err);

    client.query(
      "DELETE FROM students WHERE ID = ($1) ;",
      [req.params.id],
      function (err, result) {
        done();
        if (err) return next(err);
        else res.status(200).send("Deleted!");
      }
    );
  });
});

app.listen(8080, () => {
  console.log("Server up");
});
