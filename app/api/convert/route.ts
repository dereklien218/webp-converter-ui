import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const tempDir = os.tmpdir();
    const inputPath = path.join(tempDir, file.name);
    const outputPath = `${inputPath}.webp`;

    fs.writeFileSync(inputPath, buffer);

    return new Promise<NextResponse>((resolve) => {
        const quality = Number(formData.get("quality") ?? 80);

        execFile(
            "gif2webp",
            ["-q", quality.toString(), "-m", "6", inputPath, "-o", outputPath],
            (error) => {

            if (error) {
            return resolve(
                NextResponse.json({ error: "Conversion failed" }, { status: 500 })
            );
            }

            const webpBuffer = fs.readFileSync(outputPath);

            fs.unlinkSync(inputPath);
            fs.unlinkSync(outputPath);

            resolve(
            new NextResponse(webpBuffer, {
                headers: {
                "Content-Type": "image/webp",
                "Content-Disposition": "attachment; filename=converted.webp",
                },
            })
            );
        }
        );
    });
}
