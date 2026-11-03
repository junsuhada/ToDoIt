const { withProjectBuildGradle } = require("expo/config-plugins");

const withFirebaseBom = (config, { bom = "34.19.0" } = {}) => {
  return withProjectBuildGradle(config, (config) => {
    config.modResults.contents += `

project.ext {
  set('react-native', [
    versions: [
      firebase: [
        bom: '${bom}'
      ]
    ]
  ])
}
`;

    return config;
  });
};

module.exports = withFirebaseBom;