Accounts.onCreateUser(function(options, user) {
   
    user.profile = options.profile || {};
    // Assigns first and last names to the newly created user object
    user.profile.disease_group = options.disease_group;
    user.profile.account_type  = options.account_type;
    
    return user;
 });