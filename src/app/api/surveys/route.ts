import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const surveys = await prisma.survey.findMany({
      include: {
        poles: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: surveys });
  } catch (error) {
    // If DB is not connected yet, return informative fallback
    return NextResponse.json(
      {
        success: false,
        message: 'Database PostgreSQL belum terkoneksi atau migrasi belum dijalankan. Gunakan Zustand store untuk simulasi.',
        error: String(error),
      },
      { status: 503 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerName, idpel, jobType, location, address, officerName, poles } = body;

    const surveyNumber = `SRV-${String(Date.now()).slice(-5)}`;

    const survey = await prisma.survey.create({
      data: {
        surveyNumber,
        customerName,
        idpel,
        jobType: jobType || 'PASANG_BARU',
        location,
        address,
        officerName,
        status: 'WAITING_VERIFICATION',
        poles: {
          create: (poles || []).map((p: any, idx: number) => ({
            poleNumber: p.id || `T${idx + 1}`,
            standardName: p.std || 'Tiang A1',
            qty: p.qty || 1,
            latitude: p.lat ? parseFloat(p.lat) : null,
            longitude: p.lng ? parseFloat(p.lng) : null,
            note: p.note || null,
            photoUrl: p.photo || null,
          })),
        },
      },
      include: {
        poles: true,
      },
    });

    return NextResponse.json({ success: true, data: survey });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Gagal menyimpan survey ke PostgreSQL', error: String(error) },
      { status: 500 }
    );
  }
}
