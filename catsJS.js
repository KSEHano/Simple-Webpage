/**
 * Author: Kaja Hano
 */
//event listener for the readyness of the document
$(document).ready(wrapper);
/**
 * a wrapper function that contains all functioons that need 
 * objects from the document.
 */
function wrapper() {
    //var for dates of stay
    var from, till, tday;
    //make today as reference
    tday = new Date();
    //duration of stay
    var dur;
    var durField = $("input[type='text']")[0];
    //button
    var button = $("button")[0];
    //reseting everything to unselected and empty
    var input = $("input");
    for(var i in input){
        input[i].value = "";
        input[i].checked = false;

    }
    
    
    //EVENT LISTENERS
    //event listeners to the date input
    $(document.body).on("change","input[type = 'date']", checkDate);
    //eventlistener for change in number of days
    $(durField).on("change", checkDuration);
    //eventlistener button click
    $("button").on("click", makeTable);

    //functions
    /**
     * the checkDate() funktion checks if the dates ate in
     * the future and if the from date is ealier than 
     * the till date.
     * Because of type date in input fieled it should already
     * be a date so that does not have to be checked
     */
    function checkDate() {
        
        //reset everything
        $("#date-warning")[0].innerHTML = "";
        durField.disabled = false;
        durField.value = "";
        button.disabled = false;
        //get the dates
        from = new Date($("input[type = 'date']")[0].value);
        till = new Date($("input[type = 'date']")[1].value);
        //check if it is in the future
        if(tday > from){
            $("#date-warning")[0].innerHTML = "Date has to be in the future";
            
            $("input[type = 'date']")[0].value = "";
            
            return false;
        }
        //check if both are filled
        if((from != "" && from != "Invalid Date") && (till != "" && till != "Invalid Date")){
            //check for till > from
            if(from > till){
                $("#date-warning")[0].innerHTML = "Date in \"From\" has to be earlier than Data \"Until\"";
                button.disabled = "disabeled"
                $("input[type = 'date']")[1].value = "";
                return false;
            }else{
                /**if everything is valid calculate duration of stay and 
                * deactivate input vield for Number of days
                */
               //get the differnece between the times
                dur = Math.abs(till - from);
                //turn it from millsek into days
                dur = Math.ceil(dur / (1000 * 60 * 60 * 24));
                durField.value = dur;
                checkDuration();
                durField.disabled = "disabled";
            }
        
        }
        return true;
        
    }
    /**
     * to check the Durration I have to check if the 
     * input is an Integer and if the one of the the 
     * date fieleds is filled fill the other one
     */
    function checkDuration() {
        //reset everything
        $("#dur-warning")[0].innerHTML = "";
        dur = durField.value;
        button.disabled = false;
        //check if the value is a number
        if(!isNaN(dur)){
            //change Number to an integer
            durField.value = Math.floor(durField.value);
            dur = durField.value;
            if(dur > 30){
                $("#dur-warning")[0].innerHTML = "We only take cats for up to a month/30 days.";
                button.disabled = "disabled";
            }else{
                /**
                * calculate the other date if one of the dates is entered.
                * For that the number of dates has to be added or 
                * substracted in the right way.
                * This is only done if it is a valid entry.
                */
                from = new Date($("input[type = 'date']")[0].value);
                till = new Date($("input[type = 'date']")[1].value);
                if(from != "Invalid Date" && till == "Invalid Date"){
                    /**setting the date seems to be complicated
                     * therefore it will only apear in the table
                     */
                    till = calulateDates(from,dur,"add");
                }else if(till != "Invalid Date" && from == "Invalid Date"){
                    
                    from = calulateDates(till,dur,"sub")
                }
                
            }
        }else{
            //warning if text is entered
            $("#dur-warning")[0].innerHTML = "Please enter a number of days";
            button.disabled = "disabled";
        }
    }
    
    /** 
     * this function calculates the other date
     * if a duration and one date is enterd by the user
     */
    function calulateDates(date, duration, method) {
        var ndate, mildur;
        //so dur is not accidentally changed
        var days = duration;
        //switch between substracting and adding date
        switch (method){
            case "sub":
                mildur = Math.ceil(days * (1000 * 60 * 60 * 24));
                date = date.valueOf();
                ndate = new Date((date - mildur));
                //turn it from millsek into days
               
                break;
            case "add":
                mildur = Math.ceil(days * (1000 * 60 * 60 * 24));
                date = date.valueOf();
                ndate = new Date((date + mildur));
                break;
        }
        
        return ndate;
        
    }
    /**this funktion makes a Table with all the important
     * information in it.
     */
    function makeTable() {
        setDefault();
        var table = $(".price")[1];
        table.innerHTML = "";
        
        var tr, tdat, tdur, tser, tadd, tpri, ttot;
        var trarray = [];
        //check if a value for service is selected
        var serfield = $("input[type='radio']");
        var selected = (serfield[0].checked || serfield[1].checked) ? true : false;
        //make a table row
        tr = document.createElement("tr");
        //make the th
        tdat = document.createElement("th");
        tdat.innerHTML = "Date";
        tdur = document.createElement("th");
        tdur.innerHTML = "Durantion of stay";
        tser = document.createElement("th");
        tser.innerHTML = "Servis";
        tadd = document.createElement("th");
        tadd.innerHTML = "Additional services";
        tpri = document.createElement("th");
        tpri.innerHTML = "Price p. d.";
        ttot = document.createElement("th");
        ttot.innerHTML = "Total";
        trarray = [tdat, tdur, tser, tadd, tpri, ttot];
        //append all the stuff for header
        append(tr, trarray);
        append(table, [tr]);
        
        //first row with data
        tr  = document.createElement("tr");
        tdat = document.createElement("td");
        tdat.innerHTML = choosenDate(from) + " - " + choosenDate(till);
        
        tdur = document.createElement("td");
        tdur.innerHTML = dur;
        //dependend on the chosen service
        tser = document.createElement("td");
        if(selected){
            
            if(selected && serfield[0].checked){
                tser.innerHTML = "Home visit";
            }else{
                tser.innerHTML = "Pension";
            }
        //if no service is choosen this is the first row
        }else{
            tser.innerHTML = "Home visit";
            serfield[0].checked = true;
            
        }
        //dependend on the checkboxes
        tadd = document.createElement("th");
        if(!$("input[type='checkbox'")[0].checked){
            tadd.innerHTML = "+ Food \<br\>";
        }
        if(!$("input[type='checkbox'")[1].checked){
            tadd.innerHTML = tadd.innerHTML + "+ other Necessities" ;
        }

        tpri = document.createElement("th");
        tpri.innerHTML = calcPPD() + "&euro;";
        ttot = document.createElement("th");
        ttot.innerHTML = (calcPPD()*dur) + "&euro;";

        //append second row
        trarray = [tdat, tdur, tser, tadd, tpri, ttot];
        append(tr, trarray);
        append(table, [tr]);


        /** if no service is selected a second row is added
         * a function for the rows might have been usefull
         * but was to convoluted for the moment
         */
        if(!selected){
        tr  = document.createElement("tr");
        tdat = document.createElement("td");
        tdat.innerHTML = choosenDate(from) + " - " + choosenDate(till);  
        
        tdur = document.createElement("td");
        tdur.innerHTML = dur;
        // the one servide that is left
        tser = document.createElement("td");
        tser.innerHTML = "Pension";
        //for calculation later
        serfield[0].checked = false;
        serfield[1].checked = true;
        
        tadd = document.createElement("th");
        if(!$("input[type='checkbox'")[0].checked){
            tadd.innerHTML = "+ Food \<br\>";
        }
        if(!$("input[type='checkbox'")[1].checked){
            tadd.innerHTML = tadd.innerHTML + "+ other Necessities" ;
        }
        tpri = document.createElement("th");
        
        tpri.innerHTML = calcPPD() + "&euro;";
        ttot = document.createElement("th");
        ttot.innerHTML = (calcPPD()*dur) + "&euro;";
        //append second row
        trarray = [tdat, tdur, tser, tadd, tpri, ttot];
        append(tr, trarray);
        append(table, [tr]);
        serfield[1].checked = false;
        }
        
    }

    /** set for default values */
    function setDefault(){
        if(isNaN(dur)){
            dur = 1;
        }
    }
    /** this function allows to append all things of an array 
     * to the html
     */
    function append(parent, myarray) {
        for(var i of myarray){
            
            parent.appendChild(i);
            
        }
    }

    /** this funktion turns the computer date into a 
     * radable date
     */
    function choosenDate(date) {
       
        var readalbel
        //just to be save to catch every NaN
        
        if(isNaN(date)){
            readalbel = "";
        }else{
            //turn into dd.mm.yyyy
            readalbel = date.getDate() + "." + (date.getMonth()+ 1) + "." + date.getFullYear();
        }
        
        return readalbel;
    }

    /**
     * this function calculates the price per day (ppd)
     */
    function calcPPD() {
        var ppd;
        var serfield = $("input[type='radio']");
        if(serfield[0].checked){
            ppd = 11;
        }else if(serfield[1].checked){
            ppd = 10;
        }
        if(!$("input[type='checkbox'")[0].checked){
            ppd += 3;
        }
        if(!$("input[type='checkbox'")[1].checked){
            ppd += 2;
        }
        return ppd;
    }

}