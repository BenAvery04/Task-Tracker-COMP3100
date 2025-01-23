export function getTime(){
    var date = new Date()
    var day = String(date.getDate()).padStart(2, '0')
    var month = String(date.getMonth() + 1).padStart(2, '0')
    var year = date.getFullYear()
    var hour = String(date.getHours())
    var minutes = String(date.getMinutes())
    var seconds = String(date.getSeconds())

    return year+'-'+day+'-'+month+'-'+hour+'-'+minutes+'-'+seconds
}