/*
* TODO:
* - handle screen rotation
* - add styling
* - remove jQuery dependency
*/
var defaultHeaderName = "Velg kjøtt";
var slider;

function Kjernetemp()
{
	var me = this;
	me.setupTabButtons();
	
	var $firstView = document.createElement("div");
	me.fillView($firstView, data);
	
	var $backButton = document.getElementById("backButton");
	me.setBackButtonVisibility(false);
	var backButtonClickFn = function (event)
	{
		event.preventDefault();
        var lastIndexOfBreak = window.location.hash.lastIndexOf("-");
        window.location.hash = window.location.hash.substr(0, lastIndexOfBreak);
        me.doScroll();
    };
	$backButton.addEventListener("click", backButtonClickFn, false);
	me.setHeaderName(defaultHeaderName);
	
    window.location.hash = "0";
    slider.slidePage($($firstView));
};

Kjernetemp.prototype.setupTabButtons = function()
{
	var me = this;
	// default active button is temperatureButton
	var $temperatureButton = document.getElementById("temperatureButton");
	var $contactButton = document.getElementById("contactButton");
	
	$temperatureButton.classList.add("activeTabButton");
	
	var onTemperatureButtonClick = function(event)
	{
		event.preventDefault();
		document.getElementById("temperatureTree").style.display = "block";
		document.getElementById("contact").style.display = "none";
		$temperatureButton.classList.add("activeTabButton");
		$contactButton.classList.remove("activeTabButton");
	};
	$temperatureButton.addEventListener("click", onTemperatureButtonClick, false);
	
	var onContactButtonClick = function(event)
	{
		event.preventDefault();
		document.getElementById("temperatureTree").style.display = "none";
		document.getElementById("contact").style.display = "block";
		$temperatureButton.classList.remove("activeTabButton");
		$contactButton.classList.add("activeTabButton");
	};
	$contactButton.addEventListener("click", onContactButtonClick, false);
};

Kjernetemp.prototype.fillView = function(view, viewData)
{
	var me = this;
	for(var i = 0; i < viewData.length; i++)
	{
		var listObject = document.createElement("div");
		listObject.classList.add("listObject");
		var listObjectName = document.createElement("div");
		listObjectName.classList.add("listObjectName");
		listObjectName.innerHTML = viewData[i].name;
		listObject.appendChild(listObjectName);
		
		if(viewData[i].description)
		{
			var listObjectDescription = document.createElement("div");
			listObjectDescription.innerHTML = viewData[i].description
			listObject.appendChild(listObjectDescription);
		}
		
		listObjectClickFn = function(event)
		{
			event.preventDefault();
			var treePath = event.currentTarget.getAttribute("treePath");
			window.location.hash = window.location.hash + "-" + treePath;
            me.doScroll();
		};
		
		listObject.setAttribute("treePath", i);
		if(viewData[i].children)
		{
            listObject.classList.add("nodeHasChildren");
			listObject.addEventListener("click", listObjectClickFn, false);
			var listObjectArrow = document.createElement("div");
			listObjectArrow.innerHTML = ">";
			listObjectArrow.classList.add("listObjectArrow");
			listObject.appendChild(listObjectArrow);
		}
		view.appendChild(listObject);
	} 
};

Kjernetemp.prototype.setHeaderName = function(headerName)
{
	document.getElementById("headerName").innerHTML = headerName;
};

Kjernetemp.prototype.doScroll = function()
{
    var me = this;
    var pathToView = window.location.hash.split("-");
    
    var newViewData;
    var headerName;
    if(pathToView.length === 1)
    {
        newViewData = data;
        headerName = defaultHeaderName;
    }
    else if(pathToView.length === 2)
    {
        newViewData = data[parseInt(pathToView[1])].children;
        headerName = data[parseInt(pathToView[1])].name;
    }
    else if(pathToView.length === 3)
    {
        newViewData = data[parseInt(pathToView[1])].children[parseInt(pathToView[2])].children;
        headerName = data[parseInt(pathToView[1])].children[parseInt(pathToView[2])].name;
    }

    me.setHeaderName(headerName);
    me.setBackButtonVisibility(pathToView.length > 1);
    
    var $newCard = document.createElement("div");
    me.fillView($newCard, newViewData);
    slider.slidePage($($newCard));
};

Kjernetemp.prototype.setBackButtonVisibility = function(visible)
{
    document.getElementById("backButton").style.display = visible ? "" : "none";
}

window.onload = function () 
{
    slider = new PageSlider($(document.getElementById("scrollpane")));
	kjernetempGlobal = new Kjernetemp();
   	var attachFastClick = Origami.fastclick;
    attachFastClick(document.body);
};