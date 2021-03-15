@Library('defra-library@v-9') _

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

      stage('Run Accessibility tests') {
        test.runPa11y(repoName, BUILD_NUMBER, tag)
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

      stage('Clean up resources') {
        provision.deleteBuildResources(repoName, pr)
      }

      if (config.containsKey('finallyClosure')) {
        config['finallyClosure']()
      }
    }
  }
