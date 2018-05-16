import { Template       } from 'meteor/templating';
import { records        } from '../api/api.js';

import './body.html';
import './templates/login.html';
import './templates/logout.html';
import './templates/physician_register.html';
import './templates/physician_view.html';
import './templates/physician_groupselect.html';
import './templates/patient_register.html';
import './templates/patient_view.html';
import './templates/patient_addrecord.html';
import './templates/record.html';


if(Meteor.isClient){

  Session.setDefault('page',            'login');
  Session.setDefault('loginErr',         false);
  Session.setDefault('loginErrMessage',  '');

  Meteor.logout();

  UI.body.helpers({
    isPage: function(page){
        return Session.equals('page', page)
    },
  })

  UI.body.events({
     'click .login': function(event, template){
       Session.set('page', 'login')
    },
    'click .physician_register': function(event, template){
        Session.set('page', 'physician_register')
     },
     'click .patient_register': function(event, template){
         Session.set('page', 'patient_register')
     },
     'click .physician_group_select': function(event, template){
        var attribute = event.target.attributes.getNamedItem('data-tag').value;
        console.log("physician selected", attribute);
        Session.set('selected_group', attribute);
        Session.set('page','physician_view')
     },
      'click .backtoselect': function(event, template){
         Session.set('page', 'physician_groupselect')
     }
  
    
  })

}

//////////////////// template helpers ///////////////////
/////////////////////////////////////////////////////////

if(Meteor.isClient){

    Template.logout.events({
      'click .logout': function(event){
       event.preventDefault();
       Meteor.logout();
       Session.set('page',           'login')
       Session.set('account_id',     '');
       Session.set('disease_group',  '');
       Session.set('account_type',   '');
      }
    });

    Template.physician_register.events({
      'submit form': function(event,template) {
          event.preventDefault();
  
          var _email           = event.target.registerEmail.value;
          var _password        = event.target.registerPassword.value;
          var _disease_group   = event.target.registerDisease_Group.value;
          var _account_type    = event.target.registerAccount_Type.value;
          
          var newAccount = {
             email        :  _email,
             password     :  _password,
             disease_group : _disease_group,
             account_type  : _account_type
          };
  
          Accounts.createUser(newAccount, function(err) {
           if (err) {

               console.log('Create physician failed', err);
               Session.set('loginErr',       true);
               Session.set('loginErrMessage', err.message);
               
           } else {

               Session.set('loginErr',       false);
               Session.set('loginErrMessage', '');
               console.log('Create Physician success');
               console.log('Create Physician success account type',    Meteor.user().profile.account_type);
               console.log('Create Physician success disease_group',   Meteor.user().profile.disease_group);
               console.log('Create Physician success account id',      Meteor.userId() );
               Session.set('disease_group',  Meteor.user().profile.disease_group);
               Session.set('account_type',   Meteor.user().profile.account_type);
               Session.set('account_id',     Meteor.userId() );
               Session.set('page', 'physician_groupselect')
           }
          });

          template.find("form").reset();
  
       }
    });
 
    Template.patient_addrecord.events({
      'submit form': function(event) {
          event.preventDefault();
          var _reading           = event.target.reading.value;
          var _timestamp         = event.target.timestamp.value;
        
          var newRecord  = {
            patient_id      :   Session.get('account_id'),
            disease_group   :   Session.get('disease_group'),
            reading         :  _reading,
            timestamp       :  _timestamp,
            remarks         : ''
          };

         console.log("add record", newRecord);

         // Insert a record into the collection
         records.insert( newRecord );

        // Clear form
         event.target.reading.value = '';
         event.target.timestamp.value = '';
        }
    });

    Template.patient_register.events({
      'submit form': function(event, template) {
          event.preventDefault();
  
          var _email           = event.target.registerEmail.value;
          var _password        = event.target.registerPassword.value;
          var _disease_group   = event.target.registerDisease_Group.value;
          var _account_type    = event.target.registerAccount_Type.value;
          
          var newAccount = {
             email         :  _email,
             password      :  _password,
             disease_group :  _disease_group,
             account_type  :  _account_type
          };
  
          Accounts.createUser(newAccount, function(err) {
           if (err) {
           
              console.log('Create patient failed', err);
              Session.set('loginErr',       true);
              Session.set('loginErrMessage', err.message);
  
           } else {
  
              Session.set('loginErr',       false);
              Session.set('loginErrMessage', '');
  
              console.log('Create Patient success');
              console.log('Create Patient success account type',    Meteor.user().profile.account_type);
              console.log('Create Patient success disease_group',   Meteor.user().profile.disease_group);
              console.log('Create Patient success account id',      Meteor.userId() );

              Session.set('disease_group',  Meteor.user().profile.disease_group);
              Session.set('account_type',   Meteor.user().profile.account_type);
              Session.set('account_id',     Meteor.userId() );
              Session.set('page', 'patient_view')
           }
          });

          template.find("form").reset();
  
       }
    });
  
    Template.login.events({
      'submit form': function(event,template ) {
       event.preventDefault();
        
        var emailVar    = event.target.loginEmail.value;
        var passwordVar = event.target.loginPassword.value;
  
         Meteor.loginWithPassword(emailVar, passwordVar, function(err) {
            if (err) {
                console.log('login failed');
                console.log(err);

                Session.set('loginErr',       true);
                Session.set('loginErrMessage', err.message);

                // Clear form
                event.target.loginEmail.value = '';
                event.target.loginPassword.value = '';
                event.target.loginEmail.focus();
    
            } else {
           
                // Clear form
                event.target.loginEmail.value   = '';
                event.target.loginPassword.value = '';
    
                // ok so we have just logged in  set the next template to display
                // use the account type
                Session.set('loginErr',      false);
                Session.set('loginErrMessage', '');
  
                console.log('login success');
                console.log('login success account type',    Meteor.user().profile.account_type);
                console.log('login success disease_group',   Meteor.user().profile.disease_group);
                console.log('login success account id',      Meteor.userId());
                Session.set('disease_group',  Meteor.user().profile.disease_group);
                Session.set('account_type',   Meteor.user().profile.account_type);
                Session.set('account_id',     Meteor.userId() );
                          
                let account_type = Meteor.user().profile.account_type
                if ( account_type === 'physician')
                    Session.set('page', 'physician_groupselect')
                  else
                    Session.set('page', 'patient_view')
            }
        });

        template.find("form").reset();
        
      }
    });

    Template.record.helpers({
      'isDisabled' : function(){
          var account_type = Session.get("account_type")
          if ( account_type === 'patient') {
               return {disabled: 'disabled'};
          } else {
              // we are logged on as physician
              var profile_group  = Session.get("disease_group");
              var selected_group = Session.get("selected_group");
              if ( Session.equals('disease_group', selected_group) ) {
                  return {};
              } else {
                  return {disabled: 'disabled'};
              }
          }
    }});

    Template.record.events({

          'input .remarkinput': function (event, template) {
           
             var record_id  = event.target.attributes.getNamedItem('data-tag').value;
             var latestRemarks     = event.currentTarget.value;
             console.log("remarks for record_id", latestRemarks, record_id);
       
            // update mongo with current remarks 
            records.update( record_id, {
              $set: { remarks: latestRemarks },
            });

        }
    });
}

///////////////////////////////////////////////////
/////////////////// global helpers ////////////////
///////////////////////////////////////////////////
// get the current array of disease groups
Template.registerHelper( 'getDiseaseGroups', () => {
 
  const diseaseGroups = [
    { diseaseGroup: 'Heart Patients' },
    { diseaseGroup: 'Diabetic Patients' },
    { diseaseGroup: 'BP Patients' },
  ];

  return diseaseGroups;
  
});

// get a patients logged records
Template.registerHelper( 'getPatientRecords', () => {
      var query         = { "patient_id" : Session.get("account_id")};
      console.log(query);
      return records.find(query);
});

// get a physicians records
Template.registerHelper( 'getPhysicianRecords', () => {
  
  var query         = { "disease_group" : Session.get("selected_group")};
  console.log(query);
  return records.find(query);
});

// get the group a physicain selected
Template.registerHelper( 'getSelectedGroup', () => {
  let selectedGroup = Session.get('selected_group');
  return selectedGroup;
});

// get the logged on account assigned disease group when they
// did the signup
Template.registerHelper( 'getProfileGroup', () => {
  let profileGroup = Session.get('disease_group');
  return profileGroup;
});

Template.registerHelper( 'isPhysicianView', () => {
  return ( Session.equals("page", "physician_view"));
 });

Template.registerHelper( 'isLoginErr', () => {
      return (Session.get("loginErr"));
 });
 
 Template.registerHelper( 'getLoginErrMessage', () => {
  return (Session.get("loginErrMessage"));
});