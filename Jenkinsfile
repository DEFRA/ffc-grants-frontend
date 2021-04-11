@Library('defra-library@fix/dollar-in-app-config') _

  String defaultBranch = 'master'
  String environment = 'snd'
  String containerSrcFolder = '\\/home\\/node'
  String nodeDevelopmentImage = 'defradigital/node-development'
  String localSrcFolder = '.'
  String lcovFile = './test-output/lcov.info'
  String repoName = ''
  String pr = ''
  String tag = ''
  String mergedPrNo = ''

  node {
    try {
      stage('Ensure clean workspace') {
        deleteDir()
      }

      stage('Set default branch') {
        defaultBranch = build.getDefaultBranch(defaultBranch, 'master')
      }

      // stage('Set environment') {
      //   environment = config.environment != null ? config.environment : environment
      // }

      stage('Checkout source code') {
        build.checkoutSourceCode(defaultBranch)
      }

      stage('Set PR and tag variables') {
        def version = version.getPackageJsonVersion()
        (repoName, pr, tag, mergedPrNo) = build.getVariables(version, defaultBranch)
      }

      // stage('Build test image') {
      //   build.buildTestImage(DOCKER_REGISTRY_CREDENTIALS_ID, DOCKER_REGISTRY, repoName, BUILD_NUMBER, tag)
      // }

      // stage('Run Accessibility tests') {
      //   test.runPa11y(repoName, BUILD_NUMBER, tag)
      // }
      stage('Build & push container image') {
        build.buildAndPushContainerImage(DOCKER_REGISTRY_CREDENTIALS_ID, DOCKER_REGISTRY, repoName, tag)
      }

      stage('Helm lint') {
        test.lintHelm(repoName)
      }

      if (pr != '') {
        stage('Helm install') {
          helm.deployChart(environment, DOCKER_REGISTRY, repoName, tag, pr)
        }
      }
    } catch(e) {
      def errMsg = utils.getErrorMessage(e)
      echo("Build failed with message: $errMsg")

      stage('Send build failure slack notification') {
        notifySlack.buildFailure('#generalbuildfailures', defaultBranch)
      }

      if (config.containsKey('failureClosure')) {
        config['failureClosure']()
      }

      throw e
    } finally {
      stage('Change ownership of outputs') {
        test.changeOwnershipOfWorkspace(nodeDevelopmentImage, containerSrcFolder)
      }

      if (config.containsKey('finallyClosure')) {
        config['finallyClosure']()
      }
    }
  }