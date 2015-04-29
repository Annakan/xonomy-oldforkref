
var schoolXml = '<school name="Saint Tibulus\'s National School"><teachers><person name="Clara O\'Lara" sex="f"/><person name="Billybob Smythe" sex="m"/></teachers><students><person name="Mish Vargo" sex="f"/><person name="Iwanna Beer" sex="f"/><person name="Vern Lorn" sex="m"/><person name="Charlie McGillycuddy" sex="m" age="-8.5"/></students></school>';
var schoolSpec = {
    onchange: function () {
        //console.log("Ah been chaaanged!");
        parseTree();
    },
    validate: function(jsElement){
        if(typeof(jsElement)=="string") jsElement=Xonomy.xml2js(jsElement);
        var valid=true;
        var elementSpec=this.elements[jsElement.name];
        if(elementSpec.validate) {
            elementSpec.validate(jsElement); //validate the element
        }
        for(var iAttribute=0; iAttribute<jsElement.attributes.length; iAttribute++) {
            var jsAttribute=jsElement.attributes[iAttribute];
            var attributeSpec=elementSpec.attributes[jsAttribute.name];
            if(attributeSpec.validate) {
                if(!attributeSpec.validate(jsAttribute)) valid=false; //validate the attribute
            }
        }
        for(var iChild=0; iChild<jsElement.children.length; iChild++) {
            if(jsElement.children[iChild].type=="element") {
                var jsChild=jsElement.children[iChild];
                if(!this.validate(jsChild)) valid=false; //recurse to the child element
            }
        }
        return valid;
    },
    elements: { 
        "school": {
            menu: [
                {   caption: "Add @id",
                    action: Xonomy.newAttribute,
                    actionParameter: {name: "id", value: ""},
                    hideIf: function(jsElement){return jsElement.hasAttribute("id")}
                }
            ],
            attributes: {
                "id": {
                    asker: Xonomy.askString,
                    askerParameter: {},
                    menu: [{
                        caption: "Delete",
                        action: Xonomy.deleteAttribute,
                        actionParameter: null,
                        hideIf: function(jsAttribute){return false}
                    }],
                    validate: function(jsAttribute) {
                        if($.trim(jsAttribute.value)=="") {
                            Xonomy.warnings.push({htmlID: jsAttribute.htmlID, text: "The @id attribute should not be empty."});
                            return false;
                        }
                        return true;
                    },
                },
                "name": {
                    asker: Xonomy.askString,
                    askerParameter: {},
                    menu: [],
                    validate: function(jsAttribute) {
                        if($.trim(jsAttribute.value)=="") {
                            Xonomy.warnings.push({htmlID: jsAttribute.htmlID, text: "The @name attribute should not be empty."});
                            return false;
                        }
                        return true;
                    },
                }
            },
            collapsed: function(jsElement){return false}
        },
        "teachers": {
            menu: [{
                caption: "New <person>",
                action: Xonomy.newElementChild,
                actionParameter: "<person name='' sex=''/>",
                hideIf: function(jsElement){return false}
            }],
            collapsed: function(jsElement){return false}
        },
        "students": {
            menu: [{
                caption: "New <person>",
                action: Xonomy.newElementChild,
                actionParameter: "<person name='' sex=''/>",
                hideIf: function(jsElement){return false}
            }],
            collapsed: function(jsElement){return false}
        },
        "person": {
            canDropTo: ["teachers", "students"],
            menu: [
                {   caption: "New <person> before this",
                    action: Xonomy.newElementBefore,
                    actionParameter: "<person name='' sex=''/>",
                    hideIf: function(jsElement){return false}
                },
                {   caption: "New <person> after this",
                    action: Xonomy.newElementAfter,
                    actionParameter: "<person name='' sex=''/>",
                    hideIf: function(jsElement){return false}
                },
                {   caption: "Add @age",
                    action: Xonomy.newAttribute,
                    actionParameter: {name: "age", value: ""},
                    hideIf: function(jsElement){return jsElement.hasAttribute("age")}
                },
                {   caption: "Delete",
                    action: Xonomy.deleteElement,
                    actionParameter: null,
                    hideIf: function(jsElement){return false}
                }
            ],
            attributes: {
                "name": {
                    asker: Xonomy.askString,
                    askerParameter: {},
                    menu: [],
                    validate: function(jsAttribute) {
                        if($.trim(jsAttribute.value)=="") {
                            Xonomy.warnings.push({htmlID: jsAttribute.htmlID, text: "The @name attribute should not be empty."});
                            return false;
                        }
                        return true;
                    },
                },
                "sex": {
                    asker: Xonomy.askPicklist,
                    askerParameter: [
                        {value: "m", caption: "male"},
                        {value: "f", caption: "female"},
                        {value: "x", caption: "it's complicated"}
                    ],
                    menu: [],
                    validate: function(jsAttribute) {
                        if($.trim(jsAttribute.value)=="") {
                            Xonomy.warnings.push({htmlID: jsAttribute.htmlID, text: "The @sex attribute should not be empty."});
                            return false;
                        }
                        return true;
                    },
                },
                "age": {
                    asker: Xonomy.askString,
                    askerParameter: null,
                    menu: [{
                        caption: "Delete",
                        action: Xonomy.deleteAttribute,
                        actionParameter: null,
                        hideIf: function(jsAttribute){return false}
                    }],
                    validate: function(jsAttribute) {
                        if(!/^[0-9]+$/g.test(jsAttribute.value)) {
                            Xonomy.warnings.push({htmlID: jsAttribute.htmlID, text: "The @age attribute should be a whole number greater than zero."});
                            return false;
                        }
                        return true;
                    },
                },
            },
            collapsed: function(jsElement){return false}
        }
    }
};
var articleXml="<article id='' language='en'><title>Gleann Cholm Cille</title><body><paragraph><b>Gleann Cholm Cille</b> (anglicized as <b>Glencolumbkille</b>) is a coastal district in the southwest <i>Gaeltacht</i> of County Donegal, Ireland.</paragraph><paragraph>While Gleann Cholm Cille is still an Irish-speaking community, English has been steadily replacing Irish as the main language, with only 34% of the people speaking Irish on a daily basis in 2002.</paragraph><paragraph>Cashel (Irish: <i>An Caiseal</i>) is the main village in the district.</paragraph></body></article>";
var articleSpec={
    onchange: function(){
        //console.log("Ah been chaaanged!");
    },
    validate: function(jsElement){
        if(typeof(jsElement)=="string") jsElement=Xonomy.xml2js(jsElement);
        var valid=true;
        var elementSpec=this.elements[jsElement.name];
        if(elementSpec.validate) {
            elementSpec.validate(jsElement); //validate the element
        }
        for(var iAttribute=0; iAttribute<jsElement.attributes.length; iAttribute++) {
            var jsAttribute=jsElement.attributes[iAttribute];
            var attributeSpec=elementSpec.attributes[jsAttribute.name];
            if(attributeSpec.validate) {
                if(!attributeSpec.validate(jsAttribute)) valid=false; //validate the attribute
            }
        }
        for(var iChild=0; iChild<jsElement.children.length; iChild++) {
            if(jsElement.children[iChild].type=="element") {
                var jsChild=jsElement.children[iChild];
                if(!this.validate(jsChild)) valid=false; //recurse to the child element
            }
        }
        return valid;
    },
    elements: {
    
        //top-level structure:
        "article": {
            validate: function(jsElement) {
                if(!jsElement.hasAttribute("id")) {
                    Xonomy.warnings.push({htmlID: jsElement.htmlID, text: "This element is missing an @id attribute."});
                    return false;
                }
                return true;
            },
            attributes: {
                "id": {
                    asker: Xonomy.askString,
                    askerParameter: {},
                    menu: [],
                    validate: function(jsAttribute) {
                        if($.trim(jsAttribute.value)=="") {
                            Xonomy.warnings.push({htmlID: jsAttribute.htmlID, text: "The @id attribute should not be empty."});
                            return false;
                        }
                        return true;
                    },
                },
                "language": {
                    asker: Xonomy.askPicklist,
                    askerParameter: [
                        {value: "en", caption: "English"},
                        {value: "ga", caption: "Irish"},
                        {value: "de", caption: "German"},
                        {value: "cs", caption: "Czech"},
                    ],
                    menu: [],
                    validate: function(jsAttribute) {
                        var has=false;
                        for(var i=0; i<this.askerParameter.length; i++) {
                            if(this.askerParameter[i].value==jsAttribute.value) has=true;
                        }
                        if(!has) {
                            Xonomy.warnings.push({htmlID: jsAttribute.htmlID, text: "@\""+jsAttribute.value+"\" is not a valid value for the @language attribute."});
                            return false;
                        }
                        return true;
                    },
                }
            }, 
            menu: [],
            canDropTo: [],
            mustBeAfter: [],
            mustBeBefore: [],
            collapsed: function(jsElement){return false},
            oneliner: false,
            hasText: false,
            inlineMenu: []
        },
        "title": {
            attributes: {}, 
            menu: [],
            canDropTo: [],
            mustBeAfter: [],
            mustBeBefore: [],
            collapsed: function(jsElement){return false},
            oneliner: true,
            hasText: true,
            inlineMenu: []
        },
        "body": {
            attributes: {}, 
            menu: [
                {caption: "New <paragraph>", action: Xonomy.newElementChild, actionParameter: "<paragraph/>", hideIf: function(jsElement){return false}}
            ],
            canDropTo: [],
            mustBeAfter: [],
            mustBeBefore: [],
            collapsed: function(jsElement){return false},
            oneliner: false,
            hasText: false,
            inlineMenu: []
        },
        
        //block-level textual elements:
        "paragraph": {
            attributes: {}, 
            menu: [
                {caption: "New <paragraph> before this", action: Xonomy.newElementBefore, actionParameter: "<paragraph/>", hideIf: function(jsElement){return false}},
                {caption: "New <paragraph> after this", action: Xonomy.newElementAfter, actionParameter: "<paragraph/>", hideIf: function(jsElement){return false}},
                {caption: "Delete", action: Xonomy.deleteElement, actionParameter: null, hideIf: function(jsElement){return false}}
            ],
            canDropTo: ["body"],
            mustBeAfter: [],
            mustBeBefore: [],
            collapsed: function(jsElement){return false},
            oneliner: true,
            hasText: true,
            inlineMenu: [
                {caption: "<i> (italic)", action: Xonomy.wrap, actionParameter: {template: "<i>$</i>", placeholder: "$"}, hideIf: function(jsElement){return false}},
                {caption: "<b> (bold)", action: Xonomy.wrap, actionParameter: {template: "<b>$</b>", placeholder: "$"}, hideIf: function(jsElement){return false}},
                {caption: "<u> (underline)", action: Xonomy.wrap, actionParameter: {template: "<u>$</u>", placeholder: "$"}, hideIf: function(jsElement){return false}},
                {caption: "<a> (external link)", action: Xonomy.wrap, actionParameter: {template: "<a href=''>$</a>", placeholder: "$"}, hideIf: function(jsElement){return false}},
            ]
        },
        
        
        //inline textual elements:
        "i": {
            attributes: {}, 
            menu: [
                {caption: "Unwrap", action: Xonomy.unwrap, actionParameter: null, hideIf: function(jsElement){return false}}
            ],
            canDropTo: [],
            mustBeAfter: [],
            mustBeBefore: [],
            collapsed: function(jsElement){return false},
            oneliner: true,
            hasText: true,
            inlineMenu: [
                {caption: "<b> (bold)", action: Xonomy.wrap, actionParameter: {template: "<b>$</b>", placeholder: "$"}, hideIf: function(jsElement){return false}},
                {caption: "<u> (underline)", action: Xonomy.wrap, actionParameter: {template: "<u>$</u>", placeholder: "$"}, hideIf: function(jsElement){return false}}
            ]
        },
        "b": {
            attributes: {}, 
            menu: [
                {caption: "Unwrap", action: Xonomy.unwrap, actionParameter: null, hideIf: function(jsElement){return false}}
            ],
            canDropTo: [],
            mustBeAfter: [],
            mustBeBefore: [],
            collapsed: function(jsElement){return false},
            oneliner: true,
            hasText: true,
            inlineMenu: [
                {caption: "<i> (italic)", action: Xonomy.wrap, actionParameter: {template: "<i>$</i>", placeholder: "$"}, hideIf: function(jsElement){return false}},
                {caption: "<u> (underline)", action: Xonomy.wrap, actionParameter: {template: "<u>$</u>", placeholder: "$"}, hideIf: function(jsElement){return false}}
            ]
        },
        "u": {
            attributes: {}, 
            menu: [
                {caption: "Unwrap", action: Xonomy.unwrap, actionParameter: null, hideIf: function(jsElement){return false}}
            ],
            canDropTo: [],
            mustBeAfter: [],
            mustBeBefore: [],
            collapsed: function(jsElement){return false},
            oneliner: true,
            hasText: true,
            inlineMenu: [
                {caption: "<i> (italic)", action: Xonomy.wrap, actionParameter: {template: "<i>$</i>", placeholder: "$"}, hideIf: function(jsElement){return false}},
                {caption: "<b> (bold)", action: Xonomy.wrap, actionParameter: {template: "<b>$</b>", placeholder: "$"}, hideIf: function(jsElement){return false}}
            ]
        },
        "a": { //an external link
            attributes: {
                "href": {
                    asker: Xonomy.askString,
                    askerParameter: null,
                    explainer: null,
                    menu: [],
                    validate: function(jsAttribute) {
                        if($.trim(jsAttribute.value)=="") {
                            Xonomy.warnings.push({htmlID: jsAttribute.htmlID, text: "The @href attribute should not be empty."});
                            return false;
                        }
                        return true;
                    },
                }
            }, 
            menu: [
                {caption: "Unwrap", action: Xonomy.unwrap, actionParameter: null, hideIf: function(jsElement){return false}}
            ],
            canDropTo: [],
            mustBeAfter: [],
            mustBeBefore: [],
            collapsed: function(jsElement){return false},
            oneliner: true,
            hasText: true,
            inlineMenu: []
        },

        
    }
};


