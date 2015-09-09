var productionClient = getFSClient('sandbox'),
    sandboxClient = getFSClient('sandbox');

$(function(){
  
  initializeAuthentication();
  setupStart();
  showStart();
  
});

/**
 * Setup auth controls and events; detect the initial auth state.
 */
function initializeAuthentication(){
  var $prodAuth = $('#prod-auth').click(function(){
    productionClient.getAccessToken().then(function(token){
      $prodAuth.find('.no-auth').hide();
      $prodAuth.find('.auth').show();
      Cookies.set('production-token', token);
      showStart();
    });
  });
  
  if(productionClient.hasAccessToken()){
    $prodAuth.find('.no-auth').hide();
    $prodAuth.find('.auth').show();
  }
  
  var $sandboxAuth = $('#sandbox-auth').click(function(){
    sandboxClient.getAccessToken().then(function(token){
      $sandboxAuth.find('.no-auth').hide();
      $sandboxAuth.find('.auth').show();
      Cookies.set('sandbox-token', token);
      showStart();
    });
  });
  
  if(sandboxClient.hasAccessToken()){
    $sandboxAuth.find('.no-auth').hide();
    $sandboxAuth.find('.auth').show();
  }
}

/**
 * Bind events to the start id input
 */
function setupStart(){
  $('#start-search-btn').click(function(){
    var personId = $('#startPersonId').val().trim();
    if(!/^[A-Z0-9]+-[A-Z0-9]+$/.test(personId)){
      $('#start').addClass('has-error');
    } else {
      getStartPersonSummary(personId);
      $('#start').removeClass('has-error');
    }
  });
}

/**
 * Get and display the start person's name and lifespan
 */
function getStartPersonSummary(personId){
  $('#start-search-btn').prop('disabled', true);
  $('#start-person-details .name').text('');
  $('#start-person-details .lifespan').text('');
  $('#start-person-details .error').html('');
  
  productionClient.getPerson(personId).then(function(response){
    $('#start-search-btn').prop('disabled', false);
    var person = response.getPerson();
    $('#start-person-details .name').text(person.getDisplayName());
    $('#start-person-details .lifespan').text(person.getDisplayLifeSpan());
  }).catch(function(){
    $('#start-search-btn').prop('disabled', false);
    $('#start-person-details .error').html('<div class="alert alert-danger">Unable to load person ' + personId + '.</div>');
  });
}

/**
 * Show the start person section if we are authenticated in both environments.
 */
function showStart(){
  if(productionClient.hasAccessToken() && sandboxClient.hasAccessToken()){
    $('#start').show();
  }
}

/**
 * Create an FS SDK client for the given environment.
 */
function getFSClient(environment){
  var config = {
      client_id: 'a02j00000098ve6AAA',
      redirect_uri: document.location.origin + '/',
      environment: environment
    }, 
    token = Cookies.get(environment + '-token');
  if(token){
    config.access_token = token;
  }
  return new FamilySearch(config);
}