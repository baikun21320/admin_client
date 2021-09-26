//配置具体的修改规则
const { override, fixBabelImports,addLessLoader} = require('customize-cra');
const { getThemeVariables } = require('antd/dist/theme');
module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
	}),
	addLessLoader({
		lessOptions:{
			javascriptEnabled: true,
			// modifyVars: { '@primary-color': 'green' },
			modifyVars: getThemeVariables({
				           dark: true, // Enable dark mode
	           compact: true, // Enable compact mode
	         }),
		}
	}),
);
