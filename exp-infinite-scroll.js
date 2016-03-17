Notifications = new Mongo.Collection("notifications");
Posts = new Mongo.Collection("posts");


if (Meteor.isClient) {


  Template.postBox.onRendered(function() {
    var instance = this;
     $('#flux').bind('scroll', function(){
         if($('#flux').scrollTop() + $('#flux').innerHeight()>=$('#flux')[0].scrollHeight){

           if(Posts.find().count() === instance.limit.get()){
             instance.limit.set(instance.limit.get() + 5);
             $('body').addClass('stop-scrolling')
           }else {
             if(Posts.find().count() < instance.limit.get()){
               instance.flag.set(true);
             }
           }

         }
     });
  });


  Template.postBox.onCreated(function() {
    var instance = this;
    instance.flag = new ReactiveVar(false);
    instance.limit = new ReactiveVar(5);
    instance.autorun(function () {
      var limit = instance.limit.get();
      var subscription = instance.subscribe('posts', limit);
    });

    instance.dispNote = function() {
      return Posts.find();
    }
  });

  Template.postBox.helpers({
    post:function(){
      return Template.instance().dispNote();
    },
    status:function(){
       return  Template.instance().flag.get();
    }
  });

  Template.postBox.events({
    "click #foo": function(event, template){
      var pos = document.getElementById("flux");
      pos.scrollTop = - pos.scrollHeight;
    }
  });


  Template.notificationBox.onRendered(function() {
     var instance = this;
     $('#flux2').bind('scroll', function(){
         if($('#flux2').scrollTop() + $('#flux2').innerHeight()>=$('#flux2')[0].scrollHeight){

             if(Notifications.find().count() === instance.limit.get()){
               instance.limit.set(instance.limit.get() + 5);
             }else {
               if(Notifications.find().count() < instance.limit.get()){
                 instance.flag.set(true);
               }
             }

         }
     });
  });


  Template.notificationBox.onCreated(function() {
    var instance = this;
    instance.flag = new ReactiveVar(false);
    instance.limit = new ReactiveVar(5);
    instance.autorun(function () {
      var limit = instance.limit.get();
      var subscription = instance.subscribe('notifications', limit);

    });
    instance.dispNote = function() {
      return Notifications.find();
    }
  });




  Template.notificationBox.helpers({
    notification:function(){
      return Template.instance().dispNote();
    },
    status:function(){
       return  Template.instance().flag.get();
    }
  });



  Template.notificationBox.events({
    "click #foo": function(event, template){
      var pos = document.getElementById("flux2");
      pos.scrollTop = - pos.scrollHeight;
    }
  });

}//server ends

if (Meteor.isServer) {
  Meteor.publish("notifications", function(limit){
    return Notifications.find({},{limit});
  });
  Meteor.publish("posts", function(limit){
    return Posts.find({},{limit});
  });

  Meteor.startup(function () {
    if (Notifications.find().fetch().length === 0) {

      for (var i = 0; i < 22; i++) {

        Notifications.insert({title:Fake.word(),desc:Fake.sentence(1)});

      }

    }//if ends
    if (Posts.find().fetch().length === 0) {

      for (var i = 0; i < 22; i++) {

        Posts.insert({title:Fake.word(5),desc:Fake.sentence(3)});

      }

    }//if ends
  });


}//client ends

if (Meteor.isServer) {

  Meteor.publish("posts", function(limit){
    return Posts.find({},{limit});
  });

  Meteor.publish("notifications", function(limit){
    return Notifications.find({},{limit});
  });

  Meteor.startup(function () {
    if (Notifications.find().fetch().length === 0) {

      for (var i = 0; i < 22; i++) {
        Notifications.insert({title:Fake.word(),desc:Fake.sentence(1)});
      }

    }//if ends

    if (Posts.find().fetch().length === 0) {

      for (var i = 0; i < 22; i++) {
        Posts.insert({title:Fake.word(5),desc:Fake.sentence(3)});
      }

    }//if ends
  });
}
