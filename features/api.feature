Feature: api_e-2-e_tests
  call the API to create user, authenticate, add credit, subtract credit, and log out.


  Scenario: test
  When I GET/
  Then the response code should be 200
  
    
  Scenario: Sunday isn't Friday
    Given today is Sunday
    When I ask whether it's Friday yet
    Then I should be told "Nope"
