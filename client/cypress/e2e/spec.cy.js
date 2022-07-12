it("backend is running in test mode", function () {
  cy.visit("http://localhost:3003/api/testing");
  cy.contains("This is app is running in test mode");
});
Cypress.Commands.add("login", (user) => {
  cy.get('[data-cy="username"]').type(user.username);
  cy.get('[data-cy="password"]').type(user.password);
  cy.get('[data-cy="loginForm"]').submit();
});

describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    const user = {
      name: "Mikael Kajander",
      username: "mkajander",
      password: "salainen",
    };
    cy.request("POST", "http://localhost:3003/api/users/", user);

    const user2 = {
      name: "Dumbo User",
      username: "dumbo",
      password: "salainen",
    };
    cy.request("POST", "http://localhost:3003/api/users/", user2);
    cy.visit("http://localhost:3003");
  });

  it("Login form is shown", function () {
    cy.contains('[data-cy="loginForm"]', "Login");
  });

  describe("Login", function () {
    // using data-cy is best practice according to the docs so let's use it
    it("succeeds with correct credentials", function () {
      cy.login({ username: "mkajander", password: "salainen" });
      cy.contains("Mikael Kajander logged in");
    });

    it("fails with wrong credentials", function () {
      cy.get('[data-cy="username"]').type("mkajander");
      cy.get('[data-cy="password"]').type("wrong");
      cy.get('[data-cy="loginForm"]').submit();
      cy.contains("wrong username or password");
    });
    it("failed login notification is red", function () {
      cy.get('[data-cy="username"]').type("mkajander");
      cy.get('[data-cy="password"]').type("wrong");
      cy.get('[data-cy="loginForm"]').submit();
      cy.get('[data-cy="notification"]').should(
        "have.css",
        "color",
        "rgb(255, 0, 0)"
      );
    });
  });
  describe("When logged in", function () {
    let token = null;
    beforeEach(function () {
      const user = {
        username: "mkajander",
        password: "salainen",
      };
      cy.login(user);
      cy.request("POST", "http://localhost:3003/api/login", user).then(
        (response) => {
          token = response.body.token;
        }
      );
    });

    it("A blog can be created", function () {
      cy.contains("create new blog").click();
      cy.get("#title-input").type("test blog");
      cy.get("#author-input").type("test author");
      cy.get("#url-input").type("http://test.com");
      cy.get('[data-cy="blogForm"]').submit();
      cy.contains("test blog");
    });

    describe("and a blog exists", function () {
      beforeEach(function () {
        const blog = {
          title: "test blog",
          author: "test author",
          url: "http://test.com",
        };
        cy.request({
          method: "POST",
          url: "http://localhost:3003/api/blogs",
          body: blog,
          headers: {
            Authorization: `bearer ${token}`,
          },
        });
        cy.visit("http://localhost:3003");
      });

      it("a blog can be expanded", function () {
        cy.contains("test blog").click();
        cy.contains("likes: 0");
        cy.contains("Mikael Kajander");
      });

      it("a blog can be liked", function () {
        cy.contains("test blog").click();
        cy.get('[data-cy="like"]').click();
        cy.contains("likes: 1");
      });
      it("a blog can be deleted", function () {
        cy.contains("test blog").click();
        cy.contains("remove").click();
        cy.contains("test blog").should("not.exist");
      });
      it("a blog cannot be deleted by another user", function () {
        cy.contains("logout").click();
        cy.login({ username: "dumbo", password: "salainen" });
        cy.contains("test blog").click();
        cy.contains("remove").click();
        cy.contains("blog removal failed");
      });
    });
    describe("and multiple blogs exist", function () {
      beforeEach(function () {
        const blogs = [
          {
            title: "test blog 1",
            author: "test author 1",
            url: "http://test.com 1",
            likes: 1,
          },
          {
            title: "test blog 2",
            author: "test author 2",
            url: "http://test.com 2",
            likes: 2,
          },
          {
            title: "test blog 3",
            author: "test author 3",
            url: "http://test.com 3",
            likes: 200,
          },
          {
            title: "test blog 4",
            author: "test author 4",
            url: "http://test.com 4",
            likes: 100,
          },
        ];
        blogs.forEach((blog) => {
          cy.request({
            method: "POST",
            url: "http://localhost:3003/api/blogs",
            body: blog,
            headers: {
              Authorization: `bearer ${token}`,
            },
          });
        });
        cy.visit("http://localhost:3003");
      });
      it("blogs are sorted by likes", function () {
        cy.get('[data-cy="blog"]').eq(0).should("contain", "test blog 3");
        cy.get('[data-cy="blog"]').eq(1).should("contain", "test blog 4");
        cy.get('[data-cy="blog"]').eq(2).should("contain", "test blog 2");
        cy.get('[data-cy="blog"]').eq(3).should("contain", "test blog 1");
      });
    });
  });
});
