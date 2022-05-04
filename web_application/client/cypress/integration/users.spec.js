/// <reference types="Cypress" />
describe("The site landing page", () => { 

  it("should show the camping spots site", () => {
    cy.visit('/')
    cy.get('h1.main-navigation__title').should('contain', 'Camping Spots')
  })

  it("should open the Login view when clicking on Authenticate", () => {
    cy.visit('/')
    cy.contains('AUTHENTICATE').click()
    cy.url().should('include', '/auth')

    //check that the signup/login toggle
    cy.contains('Signup instead?').click()
    cy.get('button').should('not.contain', 'Signup instead?' )
    cy.contains('Login instead?').click()
    cy.get('button').should('not.contain', 'Login instead?' )
  })

  it("should sign up a user with valid information", () => {
    cy.visit('/auth')
    //check that the signup/login toggle
    cy.contains('Signup instead?').click()
    cy.get('button').should('not.contain', 'Signup instead?' )

    cy.get('form > .button').should('be.disabled')

    cy.get('#name').type('John Jones');
    cy.get('#email').type('john@jones.com');
    cy.get('#password').type('john1234');

    cy.get('form > .button').should('be.enabled')
    cy.get('form > .button').click()
  })

  it("should not sign up a user with valid information", () => {
    cy.visit('/auth')
    //check that the signup/login toggle
    cy.contains('Signup instead?').click()
    cy.get('button').should('not.contain', 'Signup instead?' )

    cy.get('form > .button').should('be.disabled')

    cy.get('#name').type('John Jones');
    cy.get('#email').type('john@jones.com');
    cy.get('#password').type('john1234');

    cy.get('form > .button').should('be.enabled')
    cy.get('form > .button').click()

    cy.get('#modal-hook > div').should('be.visible')
    cy.get('.modal__header > h2').should('contain', 'An Error Occurred!')
    cy.get('.modal__content > p').should('contain', 'Could not create user, user exist')
    cy.get('h2 > .button').click()

  })

  it("should show the signed up users", () => {
    cy.visit('/')
    cy.get('.card > a').should('have.text', 'John Jones Places');
  })

  it("should not allow an invalid user to login", () => {
    cy.visit('/auth')
    cy.get('form > .button').should('be.disabled')
    cy.get('#email').type('john@jones.com');
    cy.get('#password').type('johnjohn');
    cy.get('form > .button').should('be.enabled')
    cy.get('form > .button').click()

    cy.get('#modal-hook > div').should('be.visible')
    cy.get('.modal__header > h2').should('contain', 'An Error Occurred!')
    cy.get('.modal__content > p').should('contain', 'Could not identify user, credetials might be wrong')
    cy.get('h2 > .button').click()
  })

  it("should allow a valid user to login", () => {
    cy.visit('/auth')
    cy.get('form > .button').should('be.disabled')
    cy.get('#email').type('john@jones.com');
    cy.get('#password').type('john1234');
    cy.get('form > .button').should('be.enabled')
    cy.get('form > .button').click()
    
    //We should be redirected
    cy.get('.card > a').should('have.text', 'John Jones Places');
  })

  it("should show error modal if user has no places", () => {
    cy.visit('/')
    cy.get('.card > a').should('have.text', 'John Jones Places');
    cy.get('.card > a').click()

    cy.get('#modal-hook > div').should('be.visible')
    cy.get('.modal__header > h2').should('contain', 'An Error Occurred!')
    cy.get('.modal__content > p').should('contain', 'Could not find a place for the provided user id.')
    cy.get('h2 > .button').click()
  })

})