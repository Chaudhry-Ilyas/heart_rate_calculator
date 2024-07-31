import pandas as pd
from scipy import signal
from scipy.signal import lfilter, find_peaks

def getHeartrate(csv_file: str, sampling_frequency: int):
    df = pd.read_csv(filepath_or_buffer=csv_file,
                     header=None,
                     names=["RawData"])
    raw_data = df["RawData"].to_numpy()

    # Design a low-pass FIR filter with a cutoff frequency of 20 Hz using Kaiser window
    nyquist_frequency = 0.5 * sampling_frequency  # Nyquist frequency
    cutoff_low_pass = min(180, nyquist_frequency - 1)  # Low cutoff frequency in Hz
    taps_low_pass = 11  # Number of filter taps

    cutoff_notch = min(50, nyquist_frequency - 1)  # Notch frequency in Hz
    taps_notch = 55
    width = cutoff_notch / nyquist_frequency

    # Design a high-pass FIR filter with a cutoff frequency of 25 Hz using Kaiser window
    cutoff_high_pass = min(25, nyquist_frequency - 1)  # High-pass cutoff frequency in Hz
    taps_high_pass = 161  # Number of filter taps

    # Design FIR low-pass filter with Kaiser window
    coeff_low_pass = signal.firwin(taps_low_pass,
                                   cutoff=cutoff_low_pass / nyquist_frequency,
                                   fs=sampling_frequency,
                                   scale=True)
    # Design FIR bandstop filter with Kaiser window
    coeff_notch = signal.firwin(taps_notch,
                                width=0.01,
                                cutoff=[width - 0.018, width + 0.018],
                                pass_zero='bandstop')  # type: ignore

    # Design FIR high-pass filter with Kaiser window
    coeff_high_pass = signal.firwin(taps_high_pass,
                                    cutoff=cutoff_high_pass / nyquist_frequency,
                                    pass_zero=False)

    # Apply the low-pass FIR filter to the raw data
    LOWPASS = lfilter(coeff_low_pass,
                      1,
                      raw_data)

    # Apply the bandstop FIR filter to the lowpass-filtered signal
    NOTCH = lfilter(coeff_notch,
                    1,
                    LOWPASS)

    # Apply the high-pass FIR filter to the bandstop-filtered signal
    HIGHPASS = lfilter(coeff_high_pass,
                       1,
                       NOTCH)

    # Find peaks in the filtered data for S1 detection
    peaks, _ = find_peaks(HIGHPASS,
                          height=20,
                          distance=350)  # You can adjust the 'height' and 'distance' parameters as needed

    return len(peaks)
