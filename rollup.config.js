import typescript from "rollup-plugin-typescript";
import sourceMaps from "rollup-plugin-sourcemaps";
import dts from "rollup-plugin-dts";

export default [
    {
        input: 'src/index.ts',
        output: {
            file: 'index.js',
            format: 'es'
        },
        plugins: [
            typescript({
                exclude: "node_modules/**",
                typescript: require("typescript")
            }),
            sourceMaps()
        ],
    },
    {
        input: 'src/index.ts',
        output: {
            file: 'index.d.ts',
            format: 'es',
        },
        plugins: [dts()],
    }
];