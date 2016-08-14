// define base balue.
// for month: 0 denote Jan
// for week: 0 denote Sun, and 1 denote Mon
var BaseYear = 2000;
var BaseMonth = 0;
var BaseWeek = 6;

var DateObject = new Date();
var ThisYear = DateObject.getFullYear();
var ThisMonth = DateObject.getMonth()+1;
var ThisDay = DateObject.getDate();
var ToDay = DateToString(ThisYear, ThisMonth, ThisDay);
var Links = {}



// judge leap year
function isLeapYear(Year) {
    if (Year % 4 == 0 && Year % 100 != 0 || Year % 400 == 0) {
        return true;
    } else {
        return false;
    }
}

// get number of a special month
function getMonthDays(Year, Month) {
    var dict = [31,28,31,30,31,30,31,31,30,31,30,31]
    if (isLeapYear(Year) && Month == 1) {
        return 29;
    } else {
        return dict[Month];
    }
}

// get weekday
function findWeekday(Year, Month) {
    var days = 0;
    var temp, i, tempyear;
    temp = Year - BaseYear;
    for (i = 0; i < temp; i++) {
        tempyear = BaseYear + i;
        if (isLeapYear(tempyear)) {
            days += 366;
        } else {
            days += 365;
        }
    }
    for (i = 0; i < Month; i++) {
        days += getMonthDays(Year, i);
    }
    days += BaseWeek;
    return days%7;
}

// next month return [year, month]
function nextMonth(Year, Month) {
    if (Month == 11) {
        return [Year+1, 0];
    } else {
        return [Year, Month+1];
    }
}

// prev month return [year, month]
function prevMonth(Year, Month) {
    if (Year == 2000 && Month ==0) {
        return [Year, Month]
    }
    Month--;
    if (Month<0) {
        Month = 11;
        Year--;
    }
    return [Year, Month];
}

// date to string
function DateToString(Year, Month, Day) {
    var temp = ""+Year;
    if (Month<10) {
        temp = temp + "-0" + Month;
    }
    if (Month>=10) {
        temp = temp + "-" + Month;
    }
    if (Day<10) {
        temp = temp + "-0" + Day;
    }
    if (Day>=10) {
        temp = temp + "-" + Day;
    }
    return temp;
}

// reload function
function CalendarReload() {
    var Dict = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    var Year = parseInt(document.getElementById("calendar-year").attributes["calendarYear"].value);
    var Month = parseInt(document.getElementById("calendar-month").attributes["calendarMonth"].value);
    Month--;
    if (Month < 0 || Month > 11) {
        Month = 0;
    }
    if (Year < 2000 || Year > 2100) {
        Year = 2000;
    }
    document.getElementById("calendar-year").innerHTML = ""+Year;
    document.getElementById("calendar-month").innerHTML = Dict[Month];

    var weekDay = findWeekday(Year, Month);
    var monthDays = getMonthDays(Year, Month);
    var CalendarTable = document.getElementById("calendar-table");
    var Oldtb = CalendarTable.lastChild;

    var tb = document.createElement("tbody");
    var i, temp, turns, tr, date, td;
    turns = monthDays + weekDay;
    for (i=0; i < turns; i++) {
        if (i % 7 == 0) {
            if (tr) {
                tb.appendChild(tr);
            }
            tr = document.createElement("tr");
        }
        td = document.createElement("td");
        temp = document.createElement("a");
        if (i >= weekDay) {
            date = DateToString(Year,Month+1,i-weekDay+1);
            temp.innerHTML = ""+(i-weekDay+1);
            if (Links.hasOwnProperty(date)) {
                temp.className = "calendar-date-link";
                temp.href = Links[date];
            }
            if (date == ToDay) {
                temp.className = "";
                temp.id = "calendar-today";
            }
        }
        td.appendChild(temp);
        tr.appendChild(td);
    }
    tb.appendChild(tr);
    CalendarTable.removeChild(Oldtb);
    CalendarTable.appendChild(tb);
}

// start



// get all links and delete them
function getAllLinks(){
    var CalendarWrapper = document.getElementById("calendar-wrapper");
    var AllLinks = CalendarWrapper.children.valueOf();
    var temp;
    for (var i = 0; i < AllLinks.length; i++) {
        temp = AllLinks[i];
        Links[temp.innerHTML] = temp.href;
    }
    while (AllLinks.length > 0) {
        CalendarWrapper.removeChild(AllLinks[0]);
    }
}


// initial
var initial = function () {
    var calendarWrapper = document.getElementById("calendar-wrapper");

    var calendar = document.createElement("div");
    calendar.className = "calendar";

    var calendarControl = document.createElement("div");
    calendarControl.className = "calendar-control";

    var calendarTableContainer = document.createElement("div");
    calendarTableContainer.className = "calendar-table-container";

    var prev = document.createElement("a");
    prev.className = "calendar-control-prev calendar-control-button";
    prev.id = "calendarControlPrev";
    prev.innerHTML = "<<";
    calendarControl.appendChild(prev);

    var next = document.createElement("a");
    next.className = "calendar-control-next calendar-control-button";
    next.id = "calendarControlNext";
    next.innerHTML = ">>";
    calendarControl.appendChild(next);

    var m = document.createElement("span");
    var y = document.createElement("span");
    m.id = "calendar-month";
    m.setAttribute("calendarMonth",""+ThisMonth);
    y.id = "calendar-year";
    y.setAttribute("calendarYear",""+ThisYear);
    var p = document.createElement("p");
    p.className = "calendar-control-title";
    p.appendChild(m);
    p.appendChild(y);
    calendarControl.appendChild(p);

    var table = document.createElement("table");
    table.id = "calendar-table";
    var th = document.createElement("thead");
    var tb = document.createElement("tbody");
    var tr = document.createElement("tr");
    var temp;
    temp = document.createElement("th"); temp.innerHTML = "Sun"; tr.appendChild(temp);
    temp = document.createElement("th"); temp.innerHTML = "Mon"; tr.appendChild(temp);
    temp = document.createElement("th"); temp.innerHTML = "Tue"; tr.appendChild(temp);
    temp = document.createElement("th"); temp.innerHTML = "Wed"; tr.appendChild(temp);
    temp = document.createElement("th"); temp.innerHTML = "Thu"; tr.appendChild(temp);
    temp = document.createElement("th"); temp.innerHTML = "Fri"; tr.appendChild(temp);
    temp = document.createElement("th"); temp.innerHTML = "Sat"; tr.appendChild(temp);
    th.appendChild(tr);
    table.appendChild(th);
    table.appendChild(tb);
    calendarTableContainer.appendChild(table);
    calendar.appendChild(calendarControl);
    calendar.appendChild(calendarTableContainer);

    calendarWrapper.appendChild(calendar);
    CalendarReload();
}

getAllLinks();
initial();

function Prev() {
    var Year = parseInt(document.getElementById("calendar-year").attributes["calendarYear"].value);
    var Month = parseInt(document.getElementById("calendar-month").attributes["calendarMonth"].value);
    Month--;
    var temp = prevMonth(Year, Month);
    document.getElementById("calendar-year").attributes["calendarYear"].value = temp[0];
    document.getElementById("calendar-month").attributes["calendarMonth"].value = temp[1]+1;
    CalendarReload();
}

function Next() {
    var Year = parseInt(document.getElementById("calendar-year").attributes["calendarYear"].value);
    var Month = parseInt(document.getElementById("calendar-month").attributes["calendarMonth"].value);
    Month--;
    var temp = nextMonth(Year, Month);
    document.getElementById("calendar-year").attributes["calendarYear"].value = temp[0];
    document.getElementById("calendar-month").attributes["calendarMonth"].value = temp[1]+1;
    CalendarReload();
}

document.getElementById("calendarControlPrev").onclick = Prev;
document.getElementById("calendarControlNext").onclick = Next;
