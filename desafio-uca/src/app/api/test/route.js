export async function GET() {
    return Response.json({ 
        message: "API de teste funcionando!",
        timestamp: new Date().toISOString(),
        status: "success"
    });
}