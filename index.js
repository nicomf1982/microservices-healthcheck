const health = require('@cloudnative/health-connect')
let healthcheck = new health.HealthChecker()
const express = require("express")
const app = express()


app.use('/health', health.HealthEndpoint(healthcheck))

app.use("/", (req, res, next) => {
  console.log("get en /")
  res.end("ok")
})
app.listen(3000, () => {
  console.log("listen on port 3000")
  let startCheck = new health.StartupCheck('startCheck', startPromise)
  healthcheck.registerStartupCheck(startCheck)
})

// cuando ya puede recibir peticiones (readiness)
const startPromise = () =>
  new Promise(function(resolve, _reject) {
    setTimeout(function() {
      console.log('STARTED!')
      resolve()
    }, 3000)
  })


// prueba de vida  (liveness)
const serviceAPromise = () =>
  new Promise(function(resolve, _reject) {
    setTimeout(function() {
      // console.log('ALIVE!')
      resolve()
      // _reject("some error....")
    }, 350)
  })
let serviceACheck = new health.LivenessCheck('Service A', serviceAPromise)
healthcheck.registerLivenessCheck(serviceACheck)

const serviceBPromise = () =>
  new Promise(function(resolve, _reject) {
    const timeA = process.hrtime()
    setTimeout(function() {
      // console.log('ALIVE!')
      console.log(process.hrtime(timeA)[1] / 1000000)
      resolve('redis OK')
      // _reject("another error")
    }, 2000)
  })
let serviceBCheck = new health.LivenessCheck('Service B', serviceBPromise)
healthcheck.registerLivenessCheck(serviceBCheck)