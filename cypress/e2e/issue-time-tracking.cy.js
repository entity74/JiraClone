/// <reference types="Cypress" />
import { faker } from "@faker-js/faker";

describe("Testing Time tracking", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url().should("eq", `${Cypress.env("baseUrl")}project/board`);

    cy.contains("This is an issue of type: Task.").click();

    //saving initial Estimation time data as aliases
    cy.get('[placeholder="Number"]')
      .invoke("val")
      .should("be.a", "string")
      .as("initialEstimationTimeInPlaceholder");

    cy.contains("h logged")
      .invoke("text")
      .should("be.a", "string")
      .as("initialTimeLogged");

    cy.contains("h estimated")
      .invoke("text")
      .should("be.a", "string")
      .as("initialTimeEstimated");
  });

  it("Should edit estimated time and conirm it has changed ", function () {
    cy.get('[placeholder="Number"]')
      .clear()
      .type("99")
      .invoke("val")
      .should("contain", "99")
      .and("not.contain", this.initialTimeEstimated);

    cy.contains("estimated")
      .should("have.text", "99h estimated")
      .and("be.visible")
      .and("not.contain", this.initialTimeEstimated);

    verifyTicketUpdatedInfoIsShown();
  });

  it("Should remove estimated time and confirm it has been removed", function () {
    cy.get('[placeholder="Number"]')
      .clear()
      .invoke("val")
      .should("be.empty")
      .and("not.contain", this.initialEstimationTimeInPlaceholder);

    cy.contains("estimated").should("not.exist");

    verifyTicketUpdatedInfoIsShown();
  });

  it("Should update logged and remaining time and confirm changes", function () {
    cy.contains("Time Tracking").next().click();
    cy.get("[data-testid='modal:tracking']").within(() => {
      cy.get("input").eq(0).clear().type("22");
      cy.get("input").eq(1).clear().type("55");

      cy.contains("h logged")
        .invoke("text")
        .should("eq", "22h logged")
        .and("not.contain", this.initialTimeLogged);

      cy.contains("h remaining")
        .invoke("text")
        .should("eq", "55h remaining")
        .should("not.contain", this.initialTimeEstimated);

      cy.contains("Done").click();
    });

    cy.contains("h logged")
      .invoke("text")
      .should("eq", "22h logged")
      .should("not.contain", this.initialTimeLogged);

    cy.contains("h remaining")
      .invoke("text")
      .should("eq", "55h remaining")
      .should("not.contain", this.initialTimeEstimated);

    verifyTicketUpdatedInfoIsShown();
  });
});

function verifyTicketUpdatedInfoIsShown() {
  cy.contains("Updated at")
    .should("have.text", "Updated at a few seconds ago")
    .and("be.visible");
}
