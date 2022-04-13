/// <reference types="Cypress" />

describe("Camping site places", () => { 
  
  it('should be possible for a logged in user to add a place', () => {
    cy.login('john@jones.com', 'john1234')
    cy.get('.card > a').should('have.text', 'John Jones Places');
    cy.contains('ADD PLACE').click();
    cy.get('form > .button').should('be.disabled')
    cy.get('#title').type('Urho Kekkosen kansallispuisto');
    cy.get('#description').type('Urho Kekkosen kansallispuisto is fantastic');
    cy.get('#address').type('Tunturintie 1062');
    cy.get('form > .button').should('be.enabled')
    cy.get('form > .button').click()
  })  
  
  it('should be possible for a logged in user to see own place', () => {
    //cy.login('john@jones.com', 'john1234')
    //cy.get('.card > a').should('have.text', 'John Jones Places');
    cy.contains('MY PLACES').click();
    cy.url().should('include', '/places');
    cy.get(':nth-child(1) .card > .place-item__info > h2').should('have.text', 'Urho Kekkosen kansallispuisto')
    cy.get(':nth-child(1) .card > .place-item__info > h3').should('have.text', 'Tunturintie 1062')
    cy.get(':nth-child(1) .card > .place-item__info > p').should('have.text', 'Urho Kekkosen kansallispuisto is fantastic')
  })

  it('should be possible for a logged in user to edit own place', () => {
    //cy.login('john@jones.com', 'john1234')
    //cy.get('.card > a').should('have.text', 'John Jones Places');
    cy.contains('Edit').click()
    cy.get('#title').should('have.value', 'Urho Kekkosen kansallispuisto')
    cy.get('#description').should('have.value', 'Urho Kekkosen kansallispuisto is fantastic')

    cy.get('#description')
      .clear()
      .type('UKK is great!')

    cy.contains('Update place').should('be.enabled')
    cy.contains('Update place').click()

    cy.url().should('include', '/places');
  })

  it('should be possible for a logged in user to delete own place', () => {
    //cy.login('john@jones.com', 'john1234')
    //cy.get('.card > a').should('have.text', 'John Jones Places');
    cy.contains('Delete').click()
    cy.get('#modal-hook > div').should('be.visible')
    cy.get('.modal__header > h2').should('contain', 'Are you sure?')
    cy.get('.modal__content > p').should('contain', "Are you sure? Once it's gone, it's gone!")
    cy.contains('Delete').click()
    cy.url().should('include', '/places');
  })

})