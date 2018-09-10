const path = require("path");
const should = require("should"); // eslint-disable-line

/*
    PUICreateAccountComponent config (passed in constructor):
        config.routingPrefix
            if it's "/create-account", then all internal component's links
            will be in the form of "/create-account/xxxx/yyyy"
        config.linkToCreateCasePage
        config.linkToManageCasePage
            on the final screen, we render link to "create a case" and "manage a case"
*/

class PUICreateAccountComponent {
  constructor(config) {
    // TODO: some good dev-level checks for config validation needed below
    config.should.have.property("routingPrefix").which.is.a.String();
    config.routingPrefix.length.should.be.above(1);
    config.should.have.property("linkToCreateCasePage").which.is.a.String();
    config.should.have.property("linkToManageCasePage").which.is.a.String();

    this.config = config;
    this.config.routingPrefix = this.config.routingPrefix;
  }

  installToExpress(expressApp) {
    expressApp.get(
      this.config.routingPrefix,
      this.routeCreateAccount.bind(this)
    );
    expressApp.get(
      this.config.routingPrefix + "/organisation-name",
      this.routeOrganisationName.bind(this)
    );
    expressApp.get(
      this.config.routingPrefix + "/check-organisation",
      this.routeCheckOrganisationName.bind(this)
    );
    expressApp.get(
      this.config.routingPrefix + "/name",
      this.routeYourName.bind(this)
    );
    expressApp.post(
      this.config.routingPrefix + "/name",
      this.routeYourName.bind(this)
    ); // TODO: handle /check-organisation POSTed data
    expressApp.get(
      this.config.routingPrefix + "/email",
      this.routeYourEmail.bind(this)
    );
    expressApp.get(
      this.config.routingPrefix + "/password",
      this.routeYourPassword.bind(this)
    );
    expressApp.get(
      this.config.routingPrefix + "/check",
      this.routeCheckYourAnswers.bind(this)
    );
    expressApp.get(
      this.config.routingPrefix + "/confirmation",
      this.routeAcceptAndSend.bind(this)
    );
  }

  routeCreateAccount(req, res) {
    let nunjucksVariables = {
      link: {
        nextPage: this.config.routingPrefix + "/organisation-name"
      }
    };
    res.render(path.join(__dirname, "/index"), nunjucksVariables);
  }

  routeOrganisationName(req, res) {
    let nunjucksVariables = {
      link: {
        prevPage: this.config.routingPrefix,
        nextPage: this.config.routingPrefix + "/check-organisation"
      }
    };
    res.render(path.join(__dirname, "/organisation-name"), nunjucksVariables);
  }

  routeCheckOrganisationName(req, res) {
    let nunjucksVariables = {
      link: {
        prevPage: this.config.routingPrefix + "/organisation-name",
        nextPage: this.config.routingPrefix + "/name"
      }
    };
    res.render(path.join(__dirname, "/check-organisation"), nunjucksVariables);
  }

  routeYourName(req, res) {
    let nunjucksVariables = {
      link: {
        prevPage: this.config.routingPrefix + "/check-organisation",
        nextPage: this.config.routingPrefix + "/email"
      }
    };
    res.render(path.join(__dirname, "/name"), nunjucksVariables);
  }

  routeYourEmail(req, res) {
    let nunjucksVariables = {
      link: {
        prevPage: this.config.routingPrefix + "/name",
        nextPage: this.config.routingPrefix + "/password"
      }
    };
    res.render(path.join(__dirname, "/email"), nunjucksVariables);
  }

  routeYourPassword(req, res) {
    let nunjucksVariables = {
      link: {
        prevPage: this.config.routingPrefix + "/email",
        nextPage: this.config.routingPrefix + "/check"
      }
    };
    res.render(path.join(__dirname, "/password"), nunjucksVariables);
  }

  routeCheckYourAnswers(req, res) {
    let nunjucksVariables = {
      link: {
        nextPage: this.config.routingPrefix + "/confirmation"
      }
    };
    res.render(path.join(__dirname, "/check"), nunjucksVariables);
  }

  routeAcceptAndSend(req, res) {
    let nunjucksVariables = {
      link: {
        createCasePage: this.config.linkToCreateCasePage,
        manageCasePage: this.config.linkToManageCasePage
      }
    };
    res.render(path.join(__dirname, "/confirmation"), nunjucksVariables);
  }
}

module.exports.PUICreateAccountComponent = PUICreateAccountComponent;
