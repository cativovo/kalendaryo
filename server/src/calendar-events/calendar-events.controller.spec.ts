import { Test, TestingModule } from '@nestjs/testing';
import { CalendarEventsController } from './calendar-events.controller';
import { CalendarEventsService } from './calendar-events.service';

describe('CalendarEventsController', () => {
  let controller: CalendarEventsController;
  let calendarEventsService: CalendarEventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CalendarEventsController],
      providers: [CalendarEventsService],
    }).compile();

    controller = module.get<CalendarEventsController>(CalendarEventsController);
    calendarEventsService = await module.resolve<CalendarEventsService>(
      CalendarEventsService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new calendar event', async () => {
    const want = {
      id: '123',
      type: 'shift',
      from: 696969,
      to: 707070,
    };
    const mockFn = jest
      .spyOn(calendarEventsService, 'create')
      .mockImplementation(() => Promise.resolve(want));

    const payload = {
      type: 'shift' as const,
      from: 696969,
      to: 707070,
    };

    const got = await controller.create(payload);

    expect(got).toMatchObject(want);
    expect(mockFn).toHaveBeenCalledWith(payload);
  });

  it('should find all calendar events', async () => {
    const want = [
      {
        id: '123',
        type: 'shift',
        from: 696969,
        to: 707070,
      },
      {
        id: '456',
        type: 'availability',
        from: 717171,
        to: 727272,
      },
    ];
    const mockFn = jest
      .spyOn(calendarEventsService, 'findAll')
      .mockImplementation(() => Promise.resolve(want));

    const got = await controller.findAll();

    expect(got).toMatchObject(want);
    expect(mockFn).toHaveBeenCalled();
  });

  it('should find a calendar event by id', async () => {
    const want = {
      id: '123',
      type: 'shift',
      from: 696969,
      to: 707070,
    };
    const mockFn = jest
      .spyOn(calendarEventsService, 'findByID')
      .mockImplementation(() => Promise.resolve(want));

    const id = '123';
    const got = await controller.findByID(id);

    expect(got).toMatchObject(want);
    expect(mockFn).toHaveBeenCalledWith(id);
  });

  it('should update a calendar event', async () => {
    const want = {
      id: '123',
      type: 'shift',
      from: 696969,
      to: 707070,
    };
    const mockFn = jest
      .spyOn(calendarEventsService, 'update')
      .mockImplementation(() => Promise.resolve(want));

    const id = '123';
    const payload = {
      type: 'shift' as const,
      from: 696969,
    };
    const got = await controller.update(id, payload);

    expect(got).toMatchObject(want);
    expect(mockFn).toHaveBeenCalledWith(id, payload);
  });

  it('should delete a calendar event', async () => {
    const mockFn = jest.spyOn(calendarEventsService, 'remove');

    const id = '123';
    await controller.remove(id);

    expect(mockFn).toHaveBeenCalledWith(id);
  });
});
