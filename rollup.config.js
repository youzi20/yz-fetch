import typescript from "rollup-plugin-typescript";
import sourceMaps from "rollup-plugin-sourcemaps";
import dts from "rollup-plugin-dts";

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                file: 'es/index.js',
                format: 'es'
            },
            {
                file: 'dist/index.min.js',
                format: 'umd',
                name: 'Request'
            }
        ],
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
            file: 'types/index.d.ts',
            format: 'es',
        },
        plugins: [dts()],
    }
];