/**
 * 
 * Modified E Brown F24
 **/ 
import express from 'express'
import path from 'path'
import app from './app.mjs'
const port = 8820;

app.use(express.text())
app.use(express.static(path.join(path.resolve(), 'public')))

app.listen(port, () => {
  console.log('App listening at http://localhost:%d', port);
});

export default app // useful when started as a module
