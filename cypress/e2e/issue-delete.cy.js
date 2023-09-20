describe("Issue delete Test", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
      });
  });

  it("Deleting 1 element and verification", () => {
    cy.get('[data-testid="board-list:backlog')
      .should("be.visible")
      .and("have.length", "1")
      .within(() => {
        //Assertion that Backlog list contains 4 issues
        cy.get('[data-testid="list-issue"]').should("have.length", "4");
      });

    cy.contains("This is an issue of type: Task").click();

    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="icon:trash"]').should("be.visible").click();
    });
    cy.get('[data-testid="modal:confirm"]')
      .should("be.visible")
      .within(() => {
        cy.contains("Delete issue").click();
      });
    cy.get('[data-testid="modal:confirm"]').should("not.exist");

    cy.get('[data-testid="board-list:backlog')
      .should("be.visible")
      .and("have.length", "1")
      .within(() => {
        cy.get('[data-testid="list-issue"]').should("have.length", "3");
      });
  });

  it("Cancelling Deletion and verification", () => {
    cy.get('[data-testid="board-list:backlog')
      .should("be.visible")
      .and("have.length", "1")
      .within(() => {
        cy.get('[data-testid="list-issue"]').should("have.length", "4");
      });

    cy.contains("This is an issue of type: Task").click();

    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="icon:trash"]').should("be.visible").click();
    });
    cy.get('[data-testid="modal:confirm"]')
      .should("be.visible")
      .within(() => {
        cy.contains("Cancel").click();
        cy.get('[data-testid="modal:confirm"]').should("not.exist");
      });
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="icon:trash"]').parent().next().click();
    });
    getIssueDetailsModal().should("not.exist");

    cy.get('[data-testid="board-list:backlog')
      .should("be.visible")
      .and("have.length", "1")
      .within(() => {
        //Assertion that Backlog list contains 4 issues
        cy.get('[data-testid="list-issue"]').should("have.length", "4");
      });
  });

  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');
});
