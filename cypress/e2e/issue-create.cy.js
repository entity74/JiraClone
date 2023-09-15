import { faker } from "@faker-js/faker";

describe("Issue create", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board?modal-issue-create=true");
      });
  });

  it("Should create an issue and validate it successfully", () => {
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Story"]').trigger("click");

      cy.get(".ql-editor").type("TEST_DESCRIPTION");

      cy.get('input[name="title"]').type("TEST_TITLE");

      cy.get('[data-testid="select:userIds"]').click();
      cy.get('[data-testid="select-option:Lord Gaben"]').click();

      cy.get('button[type="submit"]').click();
    });

    cy.get('[data-testid="modal:issue-create"]').should("not.exist");
    cy.contains("Issue has been successfully created.").should("be.visible");

    cy.reload();
    cy.contains("Issue has been successfully created.").should("not.exist");

    cy.get('[data-testid="board-list:backlog')
      .should("be.visible")
      .and("have.length", "1")
      .within(() => {
        cy.get('[data-testid="list-issue"]')
          .should("have.length", "5")
          .first()
          .find("p")
          .contains("TEST_TITLE");
        cy.get('[data-testid="avatar:Lord Gaben"]').should("be.visible");
        cy.get('[data-testid="icon:story"]').should("be.visible");
      });
  });

  it("Should validate title is required field if missing", () => {
    //System finds modal for creating issue and does next steps inside of it

    cy.get('[data-testid="modal:issue-create"]').within(() => {
      //Try to click create issue button without filling any data
      cy.get('button[type="submit"]').click();

      //Assert that correct error message is visible
      cy.get('[data-testid="form-field:title"]').should(
        "contain",
        "This field is required"
      );
    });
  });

  it.only("Create a Bug and validate it successfully", () => {
    // setting up intercept as alias, since system is slow and UI is rendered faster than receives responses which might lead to failed test
    cy.intercept("/currentUser").as("request");

    cy.get('[data-testid="modal:issue-create"]').within(() => {
      // verifying response is received from system before entering test data
      cy.get("@request").its("response.statusCode").should("eq", 200);

      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Bug"]').trigger("click");

      cy.get('input[name="title"]').type("Bug");

      cy.get('[data-testid="select:priority"]').click();
      cy.get('[data-testid="select-option:Highest"]').trigger("click");

      cy.get(".ql-editor").type("My bug description");

      cy.get('[data-testid="select:reporterId"]').click();
      cy.get('[data-testid="select-option:Pickle Rick"]').click();

      cy.get('button[type="submit"]').click();
    });

    cy.get('[data-testid="modal:issue-create"]').should("not.exist");
    cy.contains("Issue has been successfully created.").should("be.visible");

    // cy.reload() removed to simulate endusers UX as much as possible
    // Test will not fail here but will take longer to execute

    cy.contains("Issue has been successfully created.").should("not.exist");

    //Assert than only one list with name Backlog is visible
    cy.get('[data-testid="board-list:backlog')
      .should("be.visible")
      .and("have.length", "1")
      .within(() => {
        //Separate assertion that Backlog list contains 5 issues
        cy.get('[data-testid="list-issue"]').should("have.length", "5");

        //Assert that 1st issue in Backlog list is visible and correct name, avatar, type icon are visible as well
        cy.get('[data-testid="list-issue"]')
          .eq(0)
          .should("be.visible")
          .within(() => {
            cy.get("p").should("have.text", "Bug");
            cy.get('[data-testid="icon:bug"]').should("be.visible");
            //*****************************************************
            // test will fail within next assertion since avatar is not displayed in UI = BUG !!!
            //***************************************************
            cy.get('[data-testid="avatar:Pickle Rick"]').should("be.visible");
          });
      });
  });

  it.only("Create a Task with randomizer values and validate it successfully", () => {
    const randomTitle = faker.word.words(1);
    const randomDescription = faker.word.words(10);

    // setting up intercept as alias, since system is slow and UI is rendered faster than receives responses which might lead to failed test
    cy.intercept("/currentUser").as("request");

    cy.get('[data-testid="modal:issue-create"]').within(() => {
      // verifying response is received from system before entering test data
      cy.get("@request").its("response.statusCode").should("eq", 200);

      // checking if type is by default not 'Task' then select 'Task', otherwise do nothing
      cy.get('[data-testid="select:type"]').then(($typeValue) => {
        if (!$typeValue.text().includes("Task")) {
          cy.get('[data-testid="select:type"]').click();
          cy.get('[data-testid="select-option:Task"]').trigger("click");
        }
      });

      cy.get('input[name="title"]').type(randomTitle);

      cy.get('[data-testid="select:priority"]').click();
      cy.get('[data-testid="select-option:Low"]').trigger("click");

      cy.get(".ql-editor").type(randomDescription);

      cy.get('[data-testid="select:reporterId"]').click();
      cy.get('[data-testid="select-option:Baby Yoda"]').click();

      cy.get('button[type="submit"]').click();
    });

    cy.get('[data-testid="modal:issue-create"]').should("not.exist");
    cy.contains("Issue has been successfully created.").should("be.visible");

    // cy.reload() removed to simulate endusers UX as much as possible
    // Test will not fail here but will take longer to execute

    cy.contains("Issue has been successfully created.").should("not.exist");

    //Assert than only one list with name Backlog is visible
    cy.get('[data-testid="board-list:backlog')
      .should("be.visible")
      .and("have.length", "1")
      .within(() => {
        //Separate assertion that Backlog list contains 5 issues
        cy.get('[data-testid="list-issue"]').should("have.length", "5");

        //Assert that 1st issue in Backlog list is visible and correct name, avatar, type icon are visible as well
        cy.get('[data-testid="list-issue"]')
          .eq(0)
          .should("be.visible")
          .within(() => {
            cy.get("p").should("have.text", randomTitle);
            cy.get('[data-testid="icon:task"]').should("be.visible");
            //*****************************************************
            // test will fail within next assertion since avatar is not displayed in UI = BUG !!!
            //***************************************************
            cy.get('[data-testid="avatar:Baby Yoda"]').should("be.visible");
          });
      });
  });
});
