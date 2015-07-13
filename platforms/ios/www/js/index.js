/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

        var info = null;

        document.addEventListener('deviceready', function(){
            if(!localStorage.getItem('em_data'))
            {
                var date = new Date();
                var today = date.getMonth() + '-' + date.getFullYear();

                var em_date = {data: [[[today, 0, 0], []]]};
                localStorage.setItem('em_data', JSON.stringify(em_data));
            }
            info = JSON.parse(localStorage.getItem('em_data'));
        }, false);

        function update_month()
        {
            var date = new Date();
            var today = date.getMonth() + "-" + date.getFullYear();
            if(info.data[info.data.length - 1][0][0] != today)
            {
                info.data[info.data.length] = [];
                info.data[info.data.length - 1][0] = [];
                info.data[info.data.length - 1][1] = [];
                info.data[info.data.length - 1][0][0] = today;
                info.data[info.data.length - 1][0][1] = 0;
                info.data[info.data.length - 1][0][2] = 0;
         
                localStorage.setItem("em_data", JSON.stringify(info));
            }
        }
         
        $(document).on("pagebeforecreate","#update_budget",function(){
            update_month();
            document.getElementById("month_budget").value = info.data[info.data.length - 1][0][2];
        });

        function update_budget()
        {
            info.data[info.data.length - 1][0][2] = document.getElementById("month_budget").value;
            localStorage.setItem("em_data", JSON.stringify(info));
         
            navigator.notification.alert("This month budget is updated", null, "Budget Edit Status", "Ok");
        }

        $(document).on('pagebeforecreate', '#add_transaction', function(){
            update_month();
        });

        function add_item() {
            var item = [document.getElementById('item_name').value, document.getElementById('item_cost').value];
            info.data[info.data.length - 1][1][info.data[info.data.length-1][1].length] = item;
            info.data[info.data.length - 1][0][1] = info.data[info.data.length - 1][0][1] + parseInt(document.getElementById('item_cost').value);
            localStorage.setItem('em_data', JSON.stringify(info));

            navigator.notification.alert("New item has been added to this month's transactions", null, "Transaction", "Ok")
        }

        $(document).on('pagebeforecreate', '#list_transactions', function(){
            
            update_month();

            var html = '<table id="table" data-role="tbale" data-mode="column" class="ui-responsive"><thead><tr><th>Item Name</th><th>Item Cost</th></tr></thead><tbody>';

            for(var count = 0; count < info.data[info.data.length - 1][1].length; count ++){
                html = html + "<tr><td>" + info.data[info.data.length -1][1][count][0] + "</td><td>" + info.data[info.data.length -1][1][count][1] + "</td></tr>";
                }   
            html = html + "</tbody></table>";

            document.getElementById('listTable').innerHTML = html;

            }
        })

        $(document).on('pagebeforecreate', '#chart', function(){
            var start = 0;
            var end = 0;

            if (info.data.length <= 6)
            {
                start=0
                end = info.data.length - 1;
            }
            else
            {
                start = info.data.length - 6;
                end = info.data.length - 1;
            }

            var labels = [];

            for(var iii = start; iii <= end; iii++)
            {
                labels[labels.length] = info.data[iii][0][0];
            }

            var monthly_budget = [];

            for(var iii = start; iii <= end; iii+++)
            {
                monthly_budget[monthly_budget.length] = info.data[iii][0][2];
            }

            var monthly_spent = [];
            
            for(var iii = start; iii <= end; iii+++)
            {
                monthly_spent[monthly_spent.length] = info.data[iii][0][1];
            }

            setTimeout(function(){

                var lineChartData = {
                    labels: labels,
                    datasets : [
                        {
                            label: "Monthy Budget",
                            fillColor : "rgba(220,220,220,0.2)",
                            strokeColor : "rgba(220,220,220,1)",
                            pointColor : "rgba(220,220,220,1)",
                            pointStrokeColor : "#fff",
                            pointHighlightFill : "#fff",
                            pointHighlightStroke : "rgba(220,220,220,1)",
                            data : monthly_budget
                        },
                        {
                             label: "Monthly Spendings",
                            fillColor : "rgba(151,187,205,0.2)",
                            strokeColor : "rgba(151,187,205,1)",
                            pointColor : "rgba(151,187,205,1)",
                            pointStrokeColor : "#fff",
                            pointHighlightFill : "#fff",
                            pointHighlightStroke : "rgba(151,187,205,1)",
                            data : monthly_spent
                        }
                    ]
                }

                var ctx = document.getElementById('monthly_canvas').getContext('2d');
                window.myLine = new Chart(ctx).Radar(lineChartData, {
                    responsive: true
                });
            }, 500)
        });

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();