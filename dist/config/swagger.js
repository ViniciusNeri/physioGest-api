import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "PhysioGest API",
            version: "1.0.0",
            description: "Documentação da API PhysioGest",
        },
        servers: [
            {
                url: "http://localhost:3000",
            },
        ],
    },
    apis: ["./src/presentation/**/*.ts"], // onde ficam as rotas com comentários
};
const swaggerSpec = swaggerJsdoc(options);
export function setupSwagger(app) {
    // Serve o JSON da especificação
    app.get("/swagger.json", (req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });
    // Serve a interface do Swagger UI com URL externa
    const swaggerOptions = {
        explorer: true,
        swaggerOptions: {
            urls: [
                {
                    url: "/swagger.json",
                    name: "PhysioGest API"
                }
            ]
        }
    };
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(null, swaggerOptions));
}
//# sourceMappingURL=swagger.js.map